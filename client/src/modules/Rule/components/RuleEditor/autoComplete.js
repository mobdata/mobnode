import isSet from 'util/isSet'
import { Enum } from 'enumify'

const partialMatch = (a, b) => {
  // For now: ignore error 'Invalid regular expression: \ at end of pattern'
  try {
    const match = a.match(b)
    return match !== null && match.index === 0 && a !== b
  } catch (err) {
    return false
  }
}

const complete = (_data) => {
  const list = []
  const data = Array.isArray(_data) ? _data : [_data]
  data.forEach((x) => list.push(x))
  return list
}

const completePartial = (_data, lastToken, line, ch, _mask) => {
  const list = []
  const data = Array.isArray(_data) ? _data : [_data]
  const mask = _mask !== null ? _mask : (x) => x
  data.filter((x) => partialMatch(x, lastToken))
    .forEach((x) => {
      list.push({
        text: mask(x),
        displayText: mask(x),
        from: { line, ch: ch - lastToken.length },
      })
    })
  return list
}

const getNodesAlreadyInList = (tokensBack) => {
  let nodesInUse = {}
  let i = 0
  while (isSet(tokensBack[i]) && (tokensBack[i].type === 'string'
  || tokensBack[i].type === 'comma' || tokensBack[i].type === 'whitespace'
  || tokensBack[i].type === 'variable')) {
    if (tokensBack[i].type === 'string') {
      let node = tokensBack[i].string
      /* Remove the literal quote characters from the string: */
      node = node.substring(1, node.length - 1)
      nodesInUse = { ...nodesInUse, [node]: true }
    }
    i += 1
  }
  return nodesInUse
}

const getTokens = (editor, tokenEnum, maxTokens) => {
  // Get the current line and character position of the cursor:
  const { line, ch } = editor.getCursor()

  // Get all of the mdrules mode tokens on the same line as the cursor:
  let lineTokens = []
  let start = -1
  for (let i = 1; i <= ch; i += 1) {
    const nextToken = editor.getTokenAt({ line, ch: i })
    if (nextToken.start !== start) {
      lineTokens = [...lineTokens, nextToken]
      /* eslint prefer-destructuring: off */
      start = nextToken.start
    }
  }
  lineTokens.reverse()
  lineTokens = [...lineTokens, { type: 'new-line', string: 'new-line' }]

  // We will format these line tokens and put them into this array:
  let tokens = []

  // Push up to three valid tokens into the array, formatting them as we go:
  lineTokens.some((x) => {
    let stop = false
    if (tokens.length >= maxTokens) {
      stop = true
    } else if (x.type !== 'whitespace') {
      // Convert the tokens to those specified in the tokenEnum object:
      if (x.string === '=') {
        tokens = [...tokens, tokenEnum.ASSIGN.ordinal]
      } else if (x.type === 'attribute') {
        tokens = [...tokens, tokenEnum.ATTRIBUTE.ordinal]
      } else if (x.type === 'comma') {
        tokens = [...tokens, tokenEnum.COMMA.ordinal]
      } else if (x.string === 'if') {
        tokens = [...tokens, tokenEnum.IF.ordinal]
      } else if (x.string === '[') {
        tokens = [...tokens, tokenEnum.LBRACKET.ordinal]
      } else if (x.type === 'new-line') {
        tokens = [...tokens, tokenEnum.NEWLINE.ordinal]
      } else if (x.type === 'operator') {
        tokens = [...tokens, tokenEnum.OPERATOR.ordinal]
      } else if (x.string === ']') {
        tokens = [...tokens, tokenEnum.RBRACKET.ordinal]
      } else if (x.string === 'send') {
        tokens = [...tokens, tokenEnum.SEND.ordinal]
      } else if (x.type === 'string') {
        if (x.string.match(/"/g).length > 1) {
          tokens = [...tokens, tokenEnum.STRING.ordinal]
        } else {
          tokens = [...tokens, tokenEnum.PARTIAL_STRING.ordinal]
        }
      } else if (x.string === 'to') {
        tokens = [...tokens, tokenEnum.TO.ordinal]
      } else if (x.type === 'variable') {
        tokens = [...tokens, tokenEnum.VARIABLE.ordinal]
      }
    }
    return stop
  })

  return { tokens, lineTokens }
}

const findMatch = (tokens, replaceState, maxTokens) => {
  let hashString = ''
  let match
  for (let i = 0; i < maxTokens; i += 1) {
    hashString = `${hashString}${tokens[i]}`
    match = replaceState[hashString]
    if (typeof match !== 'undefined') break
  }
  return match
}

const autoComplete = (editor, options, cm, nodes, dbs) => {
  const objects = [
    'package:',
    'package-meta:',
    'source:',
    'target:',
  ]

  const operators = [
    'is',
    'isnot',
    'isin',
    'notin',
    'gt',
    'gte',
    'lt',
    'lte',
    'mst',
    'matches',
    'exists',
  ]

  class Token extends Enum {}
  Token.initEnum([
    'ASSIGN',
    'ATTRIBUTE',
    'COMMA',
    'IF',
    'LBRACKET',
    'NEWLINE',
    'OPERATOR',
    'RBRACKET',
    'SEND',
    'STRING',
    'PARTIAL_STRING',
    'TO',
    'VARIABLE',
    'BILBO_BAGGINS',
  ])

  class State extends Enum {}
  State.initEnum([
    'NEW_LINE',
    'START_VARIABLE',
    'AFTER_ASSIGN',
    'AFTER_LBRACKET',
    'START_NODE_STRING',
    'START_QUOTELESS_NODE_STRING',
    'AFTER_NODE_STRING',
    'AFTER_NODE_STRING_AND_COMMA',
    'AFTER_RBRACKET',
    'AFTER_RBRACKET_AND_COMMA',
    'AFTER_SEND',
    'START_DATABASE_STRING',
    'START_QUOTELESS_DATABASE_STRING',
    'AFTER_DATABASE_STRING',
    'START_TO',
    'AFTER_TO',
    'AFTER_VARIABLE',
    'AFTER_VARIABLE_AND_COMMA',
    'START_IF',
    'AFTER_IF',
    'START_OBJECT',
    'AFTER_ATTRIBUTE',
    'START_OPERATOR',
  ])

  const Map = {
    [`${Token.NEWLINE.ordinal}`]:
      State.NEW_LINE,

    [`${Token.VARIABLE.ordinal}${Token.NEWLINE.ordinal}`]:
      State.START_VARIABLE,

    [`${Token.ASSIGN.ordinal}`]:
      State.AFTER_ASSIGN,

    [`${Token.LBRACKET.ordinal}`]:
      State.AFTER_LBRACKET,

    [`${Token.PARTIAL_STRING.ordinal}${Token.LBRACKET.ordinal}`]:
      State.START_NODE_STRING,

    [`${Token.PARTIAL_STRING.ordinal}${Token.COMMA.ordinal}`]:
      State.START_NODE_STRING,

    [`${Token.VARIABLE.ordinal}${Token.LBRACKET.ordinal}`]:
      State.START_QUOTELESS_NODE_STRING,

    [`${Token.VARIABLE.ordinal}${Token.COMMA.ordinal}`]:
      State.START_QUOTELESS_NODE_STRING,

    [`${Token.STRING.ordinal}${Token.LBRACKET.ordinal}`]:
      State.AFTER_NODE_STRING,

    [`${Token.STRING.ordinal}${Token.COMMA.ordinal}`]:
      State.AFTER_NODE_STRING,

    [`${Token.COMMA.ordinal}${Token.STRING.ordinal}${Token.COMMA.ordinal}`]:
      State.AFTER_NODE_STRING_AND_COMMA,

    [`${Token.COMMA.ordinal}${Token.STRING.ordinal}${Token.LBRACKET.ordinal}`]:
      State.AFTER_NODE_STRING_AND_COMMA,

    [`${Token.RBRACKET.ordinal}`]:
      State.AFTER_RBRACKET,

    [`${Token.COMMA.ordinal}${Token.RBRACKET.ordinal}`]:
      State.AFTER_RBRACKET_AND_COMMA,

    [`${Token.SEND.ordinal}`]:
      State.AFTER_SEND,

    [`${Token.PARTIAL_STRING.ordinal}${Token.SEND.ordinal}`]:
      State.START_DATABASE_STRING,

    [`${Token.VARIABLE.ordinal}${Token.SEND.ordinal}`]:
      State.START_QUOTELESS_DATABASE_STRING,

    [`${Token.STRING.ordinal}${Token.SEND.ordinal}`]:
      State.AFTER_DATABASE_STRING,

    [`${Token.VARIABLE.ordinal}${Token.TO.ordinal}`]:
      State.AFTER_VARIABLE,

    [`${Token.TO.ordinal}`]:
      State.AFTER_TO,

    [`${Token.IF.ordinal}`]:
      State.AFTER_IF,

    [`${Token.VARIABLE.ordinal}${Token.IF.ordinal}`]:
      State.START_OBJECT,

    [`${Token.ATTRIBUTE.ordinal}`]:
      State.AFTER_ATTRIBUTE,

    [`${Token.VARIABLE.ordinal}${Token.ATTRIBUTE.ordinal}`]:
      State.START_OPERATOR,
  }

  const maxTokens = 3
  const { tokens, lineTokens } = getTokens(editor, Token, maxTokens)
  const match = findMatch(tokens, Map, maxTokens)

  const { line, ch } = editor.getCursor()
  const lastToken = lineTokens[0].string
  let withSpace = lineTokens[0].type === 'whitespace'
  let list = []

  if (isSet(match)) {
    switch (match.ordinal) {
    case State.START_VARIABLE.ordinal:
      list = [
        ...list,
        ...completePartial('send ', lastToken, line, ch, null),
        ...complete('= ['),
      ]
      break
    case State.AFTER_ASSIGN.ordinal:
      list = complete('[')
      break
    case State.AFTER_LBRACKET.ordinal:
      withSpace = true
      list = complete(nodes.map((x) => `"${x}"`))
      break
    case State.START_NODE_STRING.ordinal:
      {
        const nodesInList = getNodesAlreadyInList(lineTokens)
        const nodesNotInList = nodes.filter((x) => !nodesInList[x])
        const nodesWithQuotes = nodesNotInList.map((x) => `"${x}"`)
        list = completePartial(nodesWithQuotes, lastToken, line, ch, null)
      }
      break
    case State.START_QUOTELESS_NODE_STRING.ordinal:
      {
        const nodesInList = getNodesAlreadyInList(lineTokens)
        const nodesNotInList = nodes.filter((x) => !nodesInList[x])
        const mask = (x) => `"${x}"`
        list = completePartial(nodesNotInList, lastToken, line, ch, mask)
      }
      break
    case State.AFTER_NODE_STRING.ordinal:
      withSpace = true
      {
        const nodesInList = getNodesAlreadyInList(lineTokens)
        const nodesNotInList = nodes.filter((x) => !nodesInList[x])
        const nodesWithFormatting = nodesNotInList.map((x) => `, "${x}"`)
        list = [
          ...list,
          ...complete(nodesWithFormatting),
          ...complete('],\n'),
        ]
      }
      break
    case State.AFTER_NODE_STRING_AND_COMMA.ordinal:
      {
        const nodesInList = getNodesAlreadyInList(lineTokens)
        const nodesNotInList = nodes.filter((x) => !nodesInList[x])
        const nodesWithQuotes = nodesNotInList.map((x) => `"${x}"`)
        list = complete(nodesWithQuotes)
      }
      break
    case State.AFTER_RBRACKET.ordinal:
      withSpace = true
      list = complete(',')
      break
    case State.AFTER_SEND.ordinal:
      list = complete(dbs.map((x) => `"${x}" `))
      break
    case State.START_DATABASE_STRING.ordinal:
      {
        const dbsWithQuotesAndTo = dbs.map((x) => `"${x}" `)
        list = completePartial(dbsWithQuotesAndTo, lastToken, line, ch, null)
      }
      break
    case State.START_QUOTELESS_DATABASE_STRING.ordinal:
      {
        const mask = (x) => `"${x}" `
        list = completePartial(dbs, lastToken, line, ch, mask)
      }
      break
    case State.AFTER_DATABASE_STRING.ordinal:
      list = complete('to ')
      break
    case State.AFTER_VARIABLE.ordinal:
      list = complete([
        { text: '', displayText: 'done' },
        'if ',
        { text: ',\n', displayText: ',' },
      ])
      break
    case State.AFTER_TO.ordinal:
      break
    case State.AFTER_IF.ordinal:
      list = complete(objects)
      break
    case State.START_OBJECT.ordinal:
      list = completePartial(objects, lastToken, line, ch, null)
      break
    case State.AFTER_ATTRIBUTE.ordinal:
      list = complete(operators.map((x) => `${x} `))
      break
    case State.START_OPERATOR.ordinal:
      {
        const mask = (x) => `${x} `
        list = completePartial(operators, lastToken, line, ch, mask)
      }
      break
    default:
      break
    }
  }

  if (!withSpace) {
    list = list.map((selection) => {
      let selectionWithSpace = selection
      if (typeof selection === 'string') {
        selectionWithSpace = ` ${selection}`
      }
      return selectionWithSpace
    })
  }

  return { to: cm.Pos(line, ch), from: cm.Pos(line, ch), list }
}

export default autoComplete
