/* eslint-disable */
import CodeMirror from 'codemirror'
import { defineSimpleMode } from 'codemirror/addon/mode/simple'

// The definition of the actual md-rules syntax begins here:
let mdrules = CodeMirror.defineSimpleMode('mdrules', {
  start: [
    {
      regex: /send|to|if|and|or/,
      token: 'keyword',
    },
    {
      regex: /(package-meta|package|source|target)(:)(\w*)/,
      token: ['keyword', 'operator', 'attribute'],
    },
    {
      regex: /=|isnot|isin|is|gte|lte|gt|lt|notin|matches|exists/,
      token: 'operator',
    },
    {
      regex: /\[/,
      token: 'left-bracket',
    },
    {
      regex: /\]/,
      token: 'right-bracket',
    },
    {
      regex: /,/,
      token: 'comma',
    },
    {
      regex: /\./,
      token: 'period',
    },
    {
      regex: /"(?:[^\\]|\\.)*?(?:"|$)/,
      token: 'string'
    },
    {
      regex: /\/.*\//,
      token: 'variable-2',
    },
    {
      regex: /[^\s\t\r\n,]+/,
      token: 'variable'
    },
    {
      regex: /[\s\t\r\n]+/,
      token: 'whitespace'
    },
  ]
})

export default mdrules
