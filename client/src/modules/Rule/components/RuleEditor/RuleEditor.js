import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CodeMirror from 'react-codemirror'
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';
import { Button, CircularProgress, Paper } from '@material-ui/core'
import { isEmpty } from 'lodash'
import { parse } from '@mobdata/mobdsl'
import { openDialog, closeDialog } from 'components/AppDialog'
import AppDialog from 'components/AppDialog/AppDialog'

import {
  fetchDbs,
  fetchHome,
  fetchScript,
  getDbs,
  getErrorHandler,
  getHome,
  getParsedScript,
  getPushRulesLoading,
  getScript,
  getScriptLoading,
  getShowErrorHandler,
  onError,
  setScript,
} from 'modules/Rule'

import {
  fetchConditions,
} from 'modules/Conditions'

import { fetchNodes, getParseFormattedNodes } from 'modules/Nodes'

import RuleReporter from 'modules/Rule/components/RuleEditor/RuleReporter'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/addon/hint/show-hint.css'
import 'react-popupbox/dist/react-popupbox.css'

import isSet from 'util/isSet'
import AttributeList from '../../../Attributes/AttributeList'
import { showHint } from './showHint'
import autoComplete from './autoComplete'
import './mdrulesMode'

import './lines.css'
import { triggerRulesPush } from '../../ruleTrigger';
import { fetchMdAttributes } from '../../../Attributes/attribute.actions';

class RuleEditor extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string,
    }),
    dispatch: PropTypes.func.isRequired,
    script: PropTypes.shape({
      id: PropTypes.string,
      rev: PropTypes.string,
      data: PropTypes.string,
      script: PropTypes.string,
    }).isRequired,
    parsedScript: PropTypes.shape({
      rules: PropTypes.array,
    }),
    nodes: PropTypes.shape({}),
    dbs: PropTypes.arrayOf(PropTypes.string),
    home: PropTypes.string,
    pushRulesLoading: PropTypes.bool.isRequired,
    scriptLoading: PropTypes.bool.isRequired,
    errorHandler: PropTypes.shape({
      status: PropTypes.number,
      function: PropTypes.string,
      message: PropTypes.string,
    }),
    showErrorHandler: PropTypes.bool,
  }

  static defaultProps = {
    classes: {
      root: '',
    },
    parsedScript: {},
    nodes: {},
    dbs: [],
    home: '',
    errorHandler: {
      status: -1,
      function: '',
      message: '',
    },
    showErrorHandler: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      errorLine: -1,
      options: {
        theme: 'default',
        lineNumbers: true,
        mode: 'mdrules',
        /* gutters: [
           { style: { width: '10px' }, name: 'something else' },
           ], */
        hintOptions: {
          completeSingle: false,
        },
      },
      // lint didn't like this being unused
      // uncomment this if you need to use it
      // popUp: false,
    }
  }

  componentDidMount() {
    const { dispatch, nodes } = this.props
    dispatch(fetchScript())
    dispatch(fetchDbs())
    dispatch(fetchHome())
    dispatch(fetchMdAttributes())
    dispatch(fetchConditions())
    if (isEmpty(nodes)) { dispatch(fetchNodes()) }
    const cm = this.codeMirror.getCodeMirrorInstance()
    showHint(cm)
    cm.registerHelper('hint', 'tag', (editor, options) => {
      const dbs = Object.keys(this.props.nodes)
      const cmObj = autoComplete(editor, options, cm, dbs, this.props.dbs)
      return cmObj
    })
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  componentDidUpdate() {
    const { errorHandler, showErrorHandler } = this.props
    let content
    if (showErrorHandler === true) {
      content = (
        <div>
          <p>
            {' '}
            { 'Warning unexpected event occured:' }
            {' '}
          </p>
          <p>
            {' '}
            { errorHandler.status }
            {' '}
            :
            {' '}
            { errorHandler.message }
            {' '}
          </p>
        </div>
      )
      PopupboxManager.open({ content })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  onChange = (newCode) => {
    const { dispatch } = this.props
    const parsedScript = this.parse(newCode)
    const { name } = parsedScript
    if (name === 'SyntaxError') {
      dispatch(onError(newCode))
      const { message: errorMessage } = parsedScript
      let errorLine = 0
      if (parsedScript.location) { errorLine = parsedScript.location.start.line }
      this.setState({
        errorMessage,
        errorLine,
      })
    } else {
      if (isSet(this.codeMirror)) {
        const cm = this.codeMirror.getCodeMirror()
        cm.removeLineClass(this.state.errorLine - 1, 'wrap', 'errorLine')
      }
      this.setState({
        errorMessage: '',
        errorLine: -1,
      })
      dispatch(setScript(newCode, parsedScript))
    }

    const cm = this.codeMirror.getCodeMirrorInstance()
    if (typeof cm.hint !== 'undefined') {
      cm.showHint(this.codeMirror.getCodeMirror(), cm.hint.tag)
    }
  }


  parse = (code) => {
    const { nodes, home } = this.props
    const updatedNodes = {}

    Object.keys(nodes).forEach((nodeName) => {
      const node = { ...nodes[nodeName] }
      //      const node = Object.assign({}, nodes[nodeName])
      node.url = `${node.protocol}://${node.username}:${node.password}@${node.host}:${node.port}`
      updatedNodes[nodeName] = node
    });


    try {
      // console.log(parse(code, { nodes: updatedNodes, _source_node_name: home }))
      return parse(code, { nodes: updatedNodes, _source_node_name: home })
    } catch (err) {
      // console.log(err)
      return err
    }
  }

  pushRules = async () => {
    const {
      script, nodes, home, dispatch,
    } = this.props
    // the set of changes to make if the rules are indeed pushed
    const pushfunc = () => {
      triggerRulesPush(dispatch, script, nodes, home)
      dispatch(closeDialog())
    }
    dispatch(openDialog(
      'Push Rules',
      'Are you sure you want to update the rules?',
      [{ label: 'Yes, push rules.', action: () => pushfunc(), focused: true },
        { label: 'Close', action: () => dispatch(closeDialog()) }],
      [script.data],
    ))
  }

  initCodeMirror = (instance) => {
    this.codeMirror = instance
    this.updateDimensions()
  }

  updateDimensions() {
    if (isSet(this.codeMirror)) {
      const cm = this.codeMirror.getCodeMirror()
      cm.setSize(window.innerWidth * 0.7, window.innerHeight - 208)
    }
  }

  render() {
    /* Think of 'data' as the new script and 'script' as the old script */
    const { data, script } = this.props.script
    const { classes, pushRulesLoading, scriptLoading } = this.props

    if (typeof data === 'undefined') {
      return (
        <section className={classes.root}>
          <CodeMirror
            ref={this.initCodeMirror}
            value="Loading script..."
          />
          <div>
            <PopupboxContainer />
          </div>
        </section>
      )
    } if (typeof data === 'undefined' && !scriptLoading) {
      return (
        <section className={classes.root}>
          <CodeMirror
            ref={this.initCodeMirror}
            value=""
          />
          <div>
            <PopupboxContainer />
          </div>
        </section>
      )
    }

    const { errorMessage } = this.state
    /* Determines if the push button should be disabled or if the user can repush the same rules: */
    const readyToPush = !(isSet(errorMessage)
        && errorMessage.length > 0)
        && !(data.localeCompare(script) === 0)


    const repushRules = !(isSet(errorMessage)
        && errorMessage.length > 0)
        && (data.localeCompare(script) === 0)

    let rulesMessage = ''
    if (repushRules) {
      rulesMessage = 're-push rules'
    } else {
      rulesMessage = 'push rules'
    }

    return (
      <div
        style={{
          fontSize: '1.2em',
          marginTop: 0,
        }}
      >
        <div
          style={{
            float: 'left',
            width: '80%',
          }}
        >
          <Paper>
            <CodeMirror
              ref={this.initCodeMirror}
              value={this.props.script.data}
              options={this.state.options}
              onChange={this.onChange}
              style={{ width: '500px' }}
            />
            <RuleReporter
              style={{
                marginBottom: 50,
              }}
              message={this.state.errorMessage}
            />
            <AppDialog />
            <span>

              <Button
                disabled={!readyToPush && !repushRules}
                onClick={this.pushRules}
                style={{
                  marginBottom: 7,
                  position: 'relative',
                  bottom: 225,
                  left: 30,
                }}
              >
                {rulesMessage}
              </Button>
              {
                pushRulesLoading
                  ? (
                    <CircularProgress
                      size={20}
                      thickness={5}
                      style={{
                        marginTop: 7,
                      }}
                    />
                  )
                  : <div />
              }
            </span>
          </Paper>
        </div>
        <div
          style={{
            float: 'left',
            width: '18%',
            padding: '1px',
            borderLeft: '5px solid black',
            height: '900px',
          }}
        >
          <AttributeList />
        </div>
        <div>
          <PopupboxContainer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  script: getScript(state),
  dbs: getDbs(state),
  home: getHome(state),
  parsedScript: getParsedScript(state),
  nodes: getParseFormattedNodes(state),
  pushRulesLoading: getPushRulesLoading(state),
  scriptLoading: getScriptLoading(state),
  errorHandler: getErrorHandler(state),
  showErrorHandler: getShowErrorHandler(state),
})

export default connect(mapStateToProps)(RuleEditor)
