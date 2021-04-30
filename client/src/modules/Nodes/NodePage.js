import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
// import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Paper from '@material-ui/core/Paper'

import AppDrawer from 'components/AppDrawer'
import Table from 'components/Table'
import withNodeColumns from 'modules/Nodes/components/NodeDrawer'
import withNodes from 'modules/Nodes/components/NodeTable'
import { getNodes, getSelectedNodes, deleteNodes } from 'modules/Nodes'
import AppDialog, {
  CreatePasswordDialog, EnterPasswordDialog, ChangePasswordDialog, openDialog, closeDialog,
} from 'components/AppDialog'
// import ReactUploadFile from 'react-upload-file'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import MassUpdateDialog from '../../components/AppDialog/MassUpdateDialog'
import { openMassUpdateDialog, openMassAddDialog } from '../../components/AppDialog/dialog.actions'
import { handleNodesFile } from './node.actions'
import MassAddDialog from '../../components/AppDialog/MassAddDialog'

const NodeDrawer = withNodeColumns(AppDrawer)
const NodeTable = withNodes(Table)

const styles = () => ({
  root: {
    margin: '0em',
  },
  deleteButton: {
    position: 'fixed',
    bottom: '2em',
    left: '1.5em',
    zIndex: 1,
  },
})

class NodePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
    selectedNodes: PropTypes.arrayOf(
      PropTypes.string,
    ).isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      deleteButton: PropTypes.string,
    }),
  }

  static defaultProps = {
    classes: {
      root: '',
      deleteButton: '',
    },
  }

  confirmDeleteSelectedNodes = () => {
    const { nodes, selectedNodes, dispatch } = this.props
    const nodesToDelete = selectedNodes
      .map((id) => nodes.find((node) => node.id === id))

    dispatch(openDialog(
      'Delete Nodes',
      'Are you sure you want to delete the following nodes?',
      [{ label: 'Yes, delete all', action: () => this.deleteSelectedNodes(nodesToDelete), focused: true },
        { label: 'Close', action: () => dispatch(closeDialog()) }],
      nodesToDelete.map(({ node_name: nodeName }) => nodeName),
    ))
  }

  deleteSelectedNodes = (nodes) => {
    const { dispatch } = this.props
    dispatch(deleteNodes(nodes))
    dispatch(closeDialog())
  }

  openMassUpdate = () => {
    const { nodes, dispatch } = this.props
    dispatch(openMassUpdateDialog(nodes.map((node) => ({ ...node, ...node.attributes }))))
  }

  openMassAdd = () => {
    const { dispatch } = this.props
    dispatch(openMassAddDialog())
  }

  render() {
    const {
      classes, selectedNodes, dispatch, nodes,
    } = this.props

    const fileLoad = (event) => {
      dispatch(handleNodesFile(event.target.result, nodes))
      /* if (typeof event.target.result === 'string') {
        file = event.target.result
      } */
    }

    const server = {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        /* const doc = JSON.parse(file)
        console.log(doc) */
        load()
        // Should expose an abort method so the request can be cancelled
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button

            // Let FilePond know the request has been cancelled
            abort();
          },
        };
      },
      revert: null,
    }

    const handleFile = (error, file) => {
      // eslint-disable-next-line no-undef
      console.log("handleFile hit.  File is: " + JSON.stringify(file));
      const reader = new FileReader()
      reader.onload = fileLoad
      // FilePond passes the actual file as file.file, just "file" includes all metadata
      reader.readAsText(file.file)
      setTimeout(this.removeFile, 50)
    }

    return (
      <div className={classes.root}>
        <NodeDrawer />
        <Paper>
          <AppDialog />
          <CreatePasswordDialog />
          <EnterPasswordDialog />
          <ChangePasswordDialog />
          <MassUpdateDialog />
          <MassAddDialog />
          <NodeTable />
          <Button onClick={this.openMassUpdate} color="primary" variant="contained">Mass Update Nodes</Button>
        </Paper>
        <FilePond server={server} allowRevert={false} onprocessfile={handleFile} allowMultiple />
        {selectedNodes.length > 0
          && (
            <div className={classes.deleteButton}>
              <Button onClick={this.confirmDeleteSelectedNodes} color="primary">
                <DeleteIcon />
              </Button>
            </div>
          )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nodes: getNodes(state),
  selectedNodes: getSelectedNodes(state),
})

export default withStyles(styles)(connect(mapStateToProps)(NodePage))
