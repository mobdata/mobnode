import { parse } from '@mobdata/mobdsl'
import callApi from 'util/apiCaller'
import regeneratorRuntime from 'regenerator-runtime'

import {
  pushRules,
} from 'modules/Rule'
import {
  fetchRevisions,
} from 'modules/History'

export const parseRules = (code, nodes, home) => {
  const updatedNodes = {}
  Object.keys(nodes).forEach((nodeName) => {
    //    const node = Object.assign({}, nodes[nodeName])
    const node = { ...nodes[nodeName] }
    node.url = `${node.protocol}://${node.username}:${node.password}@${node.host}:${node.port}`
    updatedNodes[nodeName] = node
  });
  try {
    return parse(code, { nodes: updatedNodes, _source_node_name: home })
  } catch (err) {
    return err
  }
}

export const triggerRulesPush = async (dispatch, sc, nd, hm, cd) => {
  let script
  let data
  let nodes
  let home
  let conditions
  // get script if it wasn't passed
  if (sc === undefined) {
    const scriptRes = await callApi('/rules/script')
    script = await scriptRes.json()
    data = await script.script
  } else {
    script = sc
    // eslint-disable-next-line prefer-destructuring
    data = script.data
  }
  // get nodes if they weren't passed
  if (nd === undefined) {
    const nodesRes = await callApi('/nodes')
    const unformattedNodes = await nodesRes.json()
    nodes = unformattedNodes.rows.reduce((acc, cur) => ({ ...acc, [cur.node_name]: cur }), {})
  } else {
    nodes = nd
  }
  // get home if it wasn't passed
  if (hm === undefined) {
    const homeRes = await callApi('/dbs/home')
    home = await homeRes.json()
  } else {
    home = { name: hm }
  }
  // get conditions if they weren't passed but they probably were
  if (cd === undefined) {
    const res = await callApi('conditions')
    const body = await res.json()
    conditions = body.rows
  } else {
    conditions = cd
  }
  // start combining rules with conditions
  // first step is pulling only the active conditions and making a single suffix from them
  const onConditionsString = conditions
    .filter((condition) => condition.on_status).map((condition) => condition.condition_text).join(' and ')
    // split out the script into each "send" line and tack on conditions suffix
    // account for whether the suffix exists, and if the rule already has an if-clause
    // finally rejoin the array into the same format it was originally in, prepped for parser
  const combinedScript = data.split(',\n')
    .map((line) => {
      let newline = line.trim()
      if (line.includes('send ')) {
        if (onConditionsString.length > 0) {
          if (line.includes(' if ')) {
            newline = newline.concat(' and ')
          } else {
            newline = newline.concat(' if ')
          }
        }
        newline = newline.concat(onConditionsString)
      }
      return newline
    }).join(',\n')

  const parsedScript = parseRules(combinedScript, nodes, home.name)
  let rulesToPush = { rules: parsedScript.rules }
  if (parsedScript.rules === undefined) {
    rulesToPush = { rules: [] }
  }

  const scriptToPush = {
    script: data,
    rev: script.rev,
    nodes,
    message: new Date(),
  }
  // if the trigger came from Conditions, remove the message so script doesn't update
  if (cd) scriptToPush.message = undefined

  // Attempt to update the rules and script:
  dispatch(pushRules(rulesToPush, scriptToPush)).then(() => {
    // Update the history page when new rules are pushed:
    if (cd === undefined) dispatch(fetchRevisions())
  })
}
