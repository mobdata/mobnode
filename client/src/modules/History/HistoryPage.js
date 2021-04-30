// all the revisions ever made to the rules script and a read-only CodeMirror
// component. When the user clicks on one of the revisions in the list, the
// script property of the revision is displayed in the CodeMirror component.

// Standard React+Redux:
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// Material UI components:
import {
  Divider, List, ListItem, ListItemText,
} from '@material-ui/core'
// History Redux functions:
import {
  fetchRevisions,
  updateSelectedRevision,
  getRevisions,
  getSelectedRevision,
} from 'modules/History'
// Utility function to check if variable is defined and not null:
import isSet from 'util/isSet'
// CodeMirror component and dependencies:
import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
// Custom CodeMirror mode for MobDate DSL:
import 'modules/Rule/components/RuleEditor/mdrulesMode'
// Get the diff function to compare commits:
import { diffLines as diff } from 'diff'
// Get the CSS for the line highlighting:
import './lines.css'

class HistoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentHeight: 300, // the height of the component
      diffFinished: false,
      // CodeMirror-specific options:
      cmOptions: {
        theme: 'default',
        lineNumbers: true,
        mode: 'mdrules',
        readOnly: true,
      },
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    // When the page first loads, check for new revisions:
    dispatch(fetchRevisions())
    // Resize the content to fit the page:
    this.updateDimensions()
    // Call updateDimensions() again whenever the browser resizes:
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Set the codemirror state when the revisions finish fetching:
    if (isSet(this.codeMirror) && isSet(nextProps)
      && nextProps.revisions.length > 1
      && isSet(nextProps.revisions[nextProps.selectedRevision])
      && isSet(nextProps.revisions[nextProps.selectedRevision + 1])
      && isSet(nextProps.revisions[nextProps.selectedRevision].script)
      && isSet(nextProps.revisions[nextProps.selectedRevision + 1].script)) {
      this.setCodeMirrorValue(
        nextProps.revisions[nextProps.selectedRevision + 1].script,
        nextProps.revisions[nextProps.selectedRevision].script,
      )
    } else if (isSet(this.codeMirror)) {
      const cm = this.codeMirror.getCodeMirror()
      cm.setValue('')
    }
  }

  componentWillUnmount() {
    // Remove the event listener bound to updateDimensions():
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  setCodeMirrorValue(oldRev, newRev) {
    // Ensure that codeMirror is initialized, then get the instance:
    if (!isSet(this.codeMirror)) {
      return
    }
    const cm = this.codeMirror.getCodeMirror()
    // Remove any line classes that may have been added before:
    cm.eachLine((line) => {
      cm.removeLineClass(line, 'wrap')
    })
    // Get the diff output between the selected revision and the next oldest:
    let diffParts = []
    if (isSet(newRev)) {
      diffParts = diff(oldRev, newRev)
    }
    let diffString = ''
    let numDiffLines = -1
    const linesAddedIndices = []
    const linesRemovedIndices = []
    diffParts.forEach((part) => {
      part.value.split('\n').forEach((line) => {
        if (line !== '') {
          diffString = `${diffString}${line}\n`
          numDiffLines += 1
          if (part.added) {
            linesAddedIndices.push(numDiffLines)
          } else if (part.removed) {
            linesRemovedIndices.push(numDiffLines)
          }
        }
      })
    })
    cm.setValue(diffString)
    linesAddedIndices.forEach((i) => {
      cm.addLineClass(i, 'wrap', 'addedLine')
    })
    linesRemovedIndices.forEach((i) => {
      cm.addLineClass(i, 'wrap', 'removedLine')
    })
  }


  // Called as a ref so that this.codeMirror is accessible globally:
  initCodeMirror = (instance) => {
    this.codeMirror = instance
  }

  // This function adapts the content height to the height of the browser:
  updateDimensions() {
    const height = window.innerHeight - 95
    this.setState({ contentHeight: height })
    if (isSet(this.codeMirror)) {
      const cm = this.codeMirror.getCodeMirror()
      cm.setSize(window.innerWidth * 0.65, height - 8)
    }
  }

  render() {
    const { revisions, selectedRevision, dispatch } = this.props
    const { contentHeight, cmOptions } = this.state
    return (
      <div
        style={{
          width: '100vw',
          height: contentHeight,
        }}
      >
        <div
          style={{
            width: '33vw',
            height: contentHeight,
            overflow: 'scroll',
            marginTop: 4,
            float: 'left',
          }}
        >
          <List>
            {' '}
            {
              revisions.map((rev, i) => (
                <div key={rev.rev}>
                  <ListItem
                    button
                    onClick={() => {
                      dispatch(updateSelectedRevision(i))
                    }}
                  >
                    {
                      selectedRevision !== i ? (
                        <ListItemText
                          primary={rev.message}
                          secondary={rev.rev}
                        />
                      ) : (
                        <ListItemText
                          primary={`${rev.message} ⏳`}
                          secondary={rev.rev}
                        />
                      )
                    }
                  </ListItem>
                  <Divider />
                </div>
              ))
            }
            {' '}

          </List>
        </div>
        <div
          style={{
            marginTop: 4,
            marginLeft: '33.3vw',
            fontSize: '1.2em',
          }}
        >
          { isSet(revisions) && revisions.length > 0 && this.state.diffFinished
            ? (
              <CodeMirror
                ref={this.initCodeMirror}
                value={revisions[selectedRevision].script}
                options={cmOptions}
              />
            )
            : (
              <CodeMirror
                ref={this.initCodeMirror}
                value="Preparing history diff..."
                options={cmOptions}
              />
            )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  revisions: getRevisions(state),
  selectedRevision: getSelectedRevision(state),
})

HistoryPage.propTypes = {
  revisions: PropTypes.arrayOf(PropTypes.object),
  selectedRevision: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

HistoryPage.defaultProps = {
  revisions: [],
}

export default connect(mapStateToProps)(HistoryPage)
