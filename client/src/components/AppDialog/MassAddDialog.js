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
import { getNodes, createNodes, updateNodes } from 'modules/Nodes'
import { ListItem, List, ListItemText } from '@material-ui/core'
import { openCreatePasswordDialog } from 'components/AppDialog'
import { closeMassAddDialog, openDialog } from './dialog.actions'


// This MassAddDialog component allows the user to add more than one node at once.  The form will ask how many
// nodes to add and increment the name and hostname values starting with the initial value. This code would
// be very specific to the format of the names of the hostnames and we've chosen to remove the button that
// links to this form.  This form can be easily be accessed via an added button on the NodePage.js.
class MassAddDialog extends Component {
    static propTypes = {
      openMassAdd: PropTypes.bool,
      nodes: PropTypes.arrayOf(PropTypes.shape({})),
      columns: PropTypes.arrayOf(PropTypes.shape({})),
      dispatchCloseDialog: PropTypes.func.isRequired,
      reserved: PropTypes.arrayOf(PropTypes.string),
      dispatch: PropTypes.func.isRequired,
      noniterable: PropTypes.arrayOf(PropTypes.string),
    }

    static defaultProps = {
      columns: [{}],
      nodes: [{}],
      openMassAdd: false,
      reserved: ['edit_password', 'password', 'rev', 'created_on', 'updated_on', 'url', 'id', 'attributes'],
      noniterable: ['protocol', 'port', 'username', 'company', 'office_type', 'classification'],
    }

    constructor(props) {
      super(props)
      this.state = {
        adds: [],
        number: 1,
      }
    }

    // Cancel function for clearing state/props
    exit = () => {
      this.setState(({ adds: [], number: 1 }))
      this.props.dispatchCloseDialog()
    }

    // Function for making sure nodes have at least the basic fields
    normalizeNodes = (nodes) => {
      const commonAttributes = ['id', 'rev', '_id', '_rev', 'node_name', 'protocol', 'host',
        'port', 'username', 'password', 'edit_password', 'attributes', 'created_on', 'updated_on', 'url']
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

    // Function for both batch handling duplicates and creating
    // the dialog options for the user
    handleMassDuplicates = (replacements, uniques, dispatch) => new Promise((resolve, reject) => {
      const closeAction = () => {
        dispatch(createNodes(uniques))
        reject(replacements)
      }
      const acceptAction = () => {
        dispatch(updateNodes(replacements)).then(dispatch(createNodes(uniques)))
        resolve(replacements)
      }
      dispatch(openDialog(
        'Duplicate Nodes Found',
        'We found nodes with the same name as ones currently in the table. Would you like to update them with the new versions?',
        [
          { label: 'No, Discard', action: closeAction, focused: false },
          { label: 'Yes, update these nodes', action: acceptAction, focused: true },
        ],
        replacements.map((node) => node.node_name),
      ))
    })

    // Function for finishing the form and creating the nodes
    commitChanges = (added) => {
      const { dispatch, nodes } = this.props
      const names = nodes.map((node) => node.node_name)
      const hosts = nodes.map((node) => node.host)
      const uniques = []
      const repeats = []

      const unique = (node) => (!names.includes(node.node_name) && !hosts.includes(node.host))
      if (added) {
        // Normilze incoming nodes
        const newNodes = this.normalizeNodes(added)
        newNodes.forEach((node) => {
          // Check if unique to the table
          if (unique(node)) {
            uniques.push(node)
          } else {
            repeats.push(node)
          }
        }, this)
      }
      // Warn about the repeated nodes then list succesfully added nodes
      if (repeats.length > 0) {
        this.handleMassDuplicates(repeats, uniques, dispatch)
      } else {
        dispatch(createNodes(uniques))
      }
    }

    // Submit function for processing/summarizing changes
    submit = () => {
      const { adds, number } = this.state
      const { dispatch } = this.props
      const added = []
      // Only commit the changes after the user has submitted the password for the nodes
      const onPasswordSubmit = (password) => {
        adds.push({ name: 'password', value: password, initial: '' })
        for (let i = 0; i < number; i += 1) {
          // TODO the iterable formatting in here, but start by just creating X node-rows
          const prepped = adds.map((att) => {
            let val = att.value
            if (att.initial.length > 0 && att.value.includes('*')) {
              const split = val.split('*')
              const currNum = Number(att.initial);
              // This parsing of the currNum and automatic incrementing of host name entirely depends on the
              // format of the hostnames of the system.
              const newNum = parseInt(currNum) + i;
              val = split.reduce((acc, cur) => `${acc}${newNum}${cur}`)
            }
            return { [att.name]: val }
          })

          added.push(prepped.reduce((acc, cur) => ({ ...acc, ...cur })))
        }
        this.commitChanges(added)
        this.exit()
      }
      dispatch(openCreatePasswordDialog('Password', 'Please enter a password for the nodes', onPasswordSubmit))
    }

    // TODO check function for the iterable symbol, maybe combine with replacement

    // outboarded function(s) for the data restructuring
    genNewAdds = (e) => {
      const { columns, reserved } = this.props
      if (typeof this.state.adds[0] === 'undefined') {
        const adds = columns.filter((col) => !reserved.includes(col.name))
          .map((col) => ({ name: col.name, value: '', initial: '' }))
        this.setState(({ adds }))
      }
      if (e.target === undefined) return
      const newAtts = this.state.adds.map((att) => {
        if (att.name === e.target.name) {
          return ({
            ...att,
            [e.target.id]: e.target.value,
          })
        }
        return att
      })
      this.setNewAdds(newAtts)
    }

    changeNumber = (e) => {
      this.setState(({ number: e.target.value }))
    }

    setNewAdds = (adds) => {
      this.setState(({ adds }))
    }

    render() {
      const { columns, reserved, noniterable } = this.props
      const adds = columns.filter((col) => !reserved.includes(col.name))
      const { number } = this.state
      const validNumber = Number.isInteger(Number(number)) && (number >= 1)

      const innerDialog = (
        adds.map((att) => (
          <ListItem key={att.name}>
            <ListItemText>{att.title}</ListItemText>
            {!noniterable.includes(att.name) ? (
              <FormControl>
                <InputLabel id={att.name}>Initial</InputLabel>
                <Input name={att.name} id="initial" onChange={this.genNewAdds} />
              </FormControl>
            )
              : (<div />)}
            <FormControl>
              <InputLabel id={att.name}>Value</InputLabel>
              <Input name={att.name} id="value" onChange={this.genNewAdds} />
            </FormControl>
          </ListItem>
        ))
      )
      return (
        <Dialog
          open={this.props.openMassAdd}
          onClose={this.exit}
          onEnter={this.genNewAdds}
        >
          <DialogTitle>Mass Node Add</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter all common values, and the number of nodes you wish to generate.
              If you would like some values to start at a number and then increment by 1,
              place a star (*) in the value where it will plug in and the starting value in initial.
              For example, for 3 nodes Initial could be 125 and value would be md-*.trinityalps.org
              to create nodes md-125.trinityalps.org - 127.trinityalps.org
              {' '}

            </DialogContentText>
            <List>
              <ListItem>
                <ListItemText>Number of nodes to generate:</ListItemText>
                <FormControl>
                  {!validNumber && (
                    <InputLabel id="number">Number must be a positive integer!</InputLabel>
                  )}
                  <Input id="number" onChange={this.changeNumber} />
                </FormControl>
              </ListItem>
              {innerDialog}
            </List>
          </DialogContent>
          <DialogActions>
            <Button id="Cancel" onClick={this.exit}>Cancel</Button>
            <Button id="Submit" onClick={this.submit} disabled={!validNumber}>Submit</Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const mapStateToProps = (state) => ({
  openMassAdd: state.dialog.openMassAdd,
  nodes: getNodes(state),
  columns: state.nodeTable.columns,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDialog: () => dispatch(closeMassAddDialog()),
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(MassAddDialog)
