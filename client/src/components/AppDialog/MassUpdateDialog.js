import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { ListItem, List, ListItemText } from '@material-ui/core'
import { closeMassUpdateDialog } from './dialog.actions'
import { updateNodes } from '../../modules/Nodes/node.actions'

class MassUpdateDialog extends Component {
    static propTypes = {
      openMassUpdate: PropTypes.bool,
      nodes: PropTypes.arrayOf(PropTypes.shape({})),
      columns: PropTypes.arrayOf(PropTypes.shape({})),
      dispatchCloseDialog: PropTypes.func.isRequired,
      reserved: PropTypes.arrayOf(PropTypes.string),
      dispatch: PropTypes.func.isRequired,
    }

    static defaultProps = {
      nodes: [{}],
      columns: [{}],
      openMassUpdate: false,
      reserved: ['host', 'node_name', 'edit_password', 'rev', 'created_on', 'updated_on', 'url', 'id', 'attributes'],
    }

    constructor(props) {
      super(props)
      this.state = {
        updates: [],
      }
    }

    // Cancel function for clearing state/props
    exit = () => {
      this.setState(({ updates: [] }))
      this.props.dispatchCloseDialog()
    }

    normalizeNodes = (nodes) => {
      const commonAttributes = ['id', 'rev', '_id', '_rev', 'node_name', 'protocol', 'host',
        'port', 'username', 'edit_password', 'attributes', 'created_on', 'updated_on', 'url']
      const unformattedNodes = Array.isArray(nodes) ? nodes : [nodes]
      const newNodes = unformattedNodes.map((node) => {
        const entries = Object.entries(node)
        const customAttributes = entries
          .filter((entry) => !commonAttributes.includes(entry[0]))
          .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
        const attributes = entries
          .filter((entry) => commonAttributes.includes(entry[0]))
          .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
        const protocol = node.protocol ? node.protocol : 'https'
        const port = node.port ? node.port : '6984'
        const urlString = `${protocol}://${node.host}:${port}`

        return {
          ...attributes,
          url: urlString,
          edit_password: node.id,
          attributes: { ...node.attributes, ...customAttributes },
        }
      })
      return newNodes
    }

    // Submit function for processing/summarizing changes
    submit = () => {
      const { updates } = this.state
      const { nodes, dispatch } = this.props
      const changed = []
      const updated = this.normalizeNodes(nodes.map((node) => ((node.id !== 'home_node')
        ? Object.keys(node).reduce((acc, cur) => {
          const update = updates.find((att) => att.name === cur)
          if (update && update.newValue !== '') {
            if (update.oldValue === '' || update.oldValue === node[cur]) {
              changed.push(node.node_name)
              return ({ ...acc, [cur]: update.newValue })
            }
          }
          return acc
        }, node)
        : node)).filter((node) => changed.includes(node.node_name)))
      dispatch(updateNodes(updated))
      this.exit()
    }

    // ? Confirm function that either finalizes submit or exits

    // outboarded function(s) for the data restructuring
    genNewUpdates = (e) => {
      const { columns, reserved } = this.props
      if (typeof this.state.updates[0] === 'undefined') {
        const updates = columns.filter((col) => !reserved.includes(col.name))
          .map((col) => ({ name: col.name, oldValue: '', newValue: '' }))
        this.setState(({ updates }))
      }
      if (e.target === undefined) return
      const newAtts = this.state.updates.map((att) => {
        if (att.name === e.target.name) {
          return ({
            ...att,
            [e.target.id]: e.target.value,
          })
        }
        return att
      })
      this.setNewUpdates(newAtts)
    }

    setNewUpdates = (updates) => {
      this.setState(({ updates }))
    }

    render() {
      const { columns, reserved } = this.props
      const updates = columns.filter((col) => !reserved.includes(col.name))

      const innerDialog = (
        updates.map((att) => (
          <ListItem key={att.name}>
            <ListItemText>{att.title}</ListItemText>
            <FormControl>
              <InputLabel id={att.name}>Old Value</InputLabel>
              <Input name={att.name} id="oldValue" onChange={this.genNewUpdates} />
            </FormControl>
            <FormControl>
              <InputLabel id={att.name}>New Value</InputLabel>
              <Input name={att.name} id="newValue" onChange={this.genNewUpdates} />
            </FormControl>
          </ListItem>
        ))
      )
      return (
        <Dialog
          open={this.props.openMassUpdate}
          onClose={this.exit}
          onEnter={this.genNewUpdates}
        >
          <DialogTitle>Mass Node Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter old values to change, and the new values to replace them with.
              Leaving the old value blank and entering a new value
              will instead update all nodes to have the new value.
              {' '}

            </DialogContentText>
            <List>{innerDialog}</List>
          </DialogContent>
          <DialogActions>
            <Button id="Cancel" onClick={this.exit}>Cancel</Button>
            <Button id="Submit" onClick={this.submit}>Submit</Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const mapStateToProps = (state) => ({
  openMassUpdate: state.dialog.openMassUpdate,
  nodes: state.dialog.nodes,
  columns: state.nodeTable.columns,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDialog: () => dispatch(closeMassUpdateDialog()),
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(MassUpdateDialog)
