/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import _ from 'lodash'

import { // Redux actions related to dialogs (they appear on password creation/change)
  openDialog, closeDialog, openCreatePasswordDialog, openChangePasswordDialog,
} from 'components/AppDialog'

import { // Redux actions related to the info in the table, namely the nodes themselves
  getNodes,
  getFlattenedNodes,
  getSelectedNodes,
  fetchNodes,
  createNodes,
  selectNodes,
  deleteNodes,
  attemptPasswordChange,
  updateNodes,
} from 'modules/Nodes'
import { // Redux actions involving the table itself
  changeColumns,
  changeColumnOrder,
  changeColumnWidths,
  changeFilters,
  changeSorting,
  changeEditingRows,
  changeChangedRows,
  changeAddedRows,
  changeHiddenColumns,
} from 'components/Table'
import { triggerRulesPush } from 'modules/Rule'

const dateFormat = 'MMMM Do YYYY, h:mm A'

// eslint-disable-next-line react/prop-types
const DateFormatter = ({ value }) => (
  typeof value !== 'undefined'
    ? <span>{moment(value).format(dateFormat)}</span>
    : <span />
)

const DateTypeProvider = () => (
  <DataTypeProvider
    for={['date']}
    formatterComponent={DateFormatter}
    editorComponent={({ value }) => <span>{moment(value).format(dateFormat)}</span>}
  />
)

const DisabledTypeProvider = () => (
  <DataTypeProvider
    for={['disabled']}
    editorComponent={({ value }) => <span>{value}</span>}
  />
)

let previousAttributes = ['id', 'rev', '_id', '_rev', 'node_name', 'protocol', 'host',
  'port', 'username', 'attributes', 'created_on', 'updated_on', 'url']


const getRowId = ({ id: nodeId }) => nodeId

const tableWithNodes = (WrappedComponent) => {
  class NodeTable extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      nodes: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
      flattenedNodes: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
      selectedNodes: PropTypes.arrayOf(
        PropTypes.string,
      ).isRequired,
      columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
      columnWidths: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
      sorting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      editingRows: PropTypes.arrayOf(PropTypes.string).isRequired,
      addedRows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      changedRows: PropTypes.shape({}).isRequired,
    }

    constructor(props) {
      super(props)
      const columns = [
        { name: 'edit_password', title: 'Edit Password' },
        { name: 'node_name', title: 'Name' },
        { name: 'protocol', title: 'Protocol', dataType: 'disabled' },
        { name: 'host', title: 'Host' },
        { name: 'port', title: 'Port' },
        { name: 'username', title: 'Username' },
        { name: 'created_on', title: 'Created On', dataType: 'date' },
        { name: 'updated_on', title: 'Updated On', dataType: 'date' },
      ]

      const columnOrder = [
        'edit_password',
        'node_name',
        'protocol',
        'host',
        'port',
        'username',
        'created_on',
        'updated_on',
      ]

      const columnWidths = [
        { columnName: 'edit_password', width: 140 },
        { columnName: 'node_name', width: 90 },
        { columnName: 'protocol', width: 90 },
        { columnName: 'host', width: 180 },
        { columnName: 'port', width: 90 },
        { columnName: 'username', width: 90 },
        { columnName: 'created_on', width: 180 },
        { columnName: 'updated_on', width: 180 },
      ]

      const { dispatch } = props


      if (props.columns.length === 0) {
        dispatch(changeColumns('NodeTable', columns))
      }

      if (props.columnOrder.length === 0) {
        dispatch(changeColumnOrder('NodeTable', columnOrder))
      }

      if (_.isEmpty(props.columnWidths)) {
        dispatch(changeColumnWidths('NodeTable', columnWidths))
      }
    }

    componentDidMount() {
      const { nodes } = this.props
      if (nodes.length === 0) {
        this.props.dispatch(fetchNodes())
      }
    }

    /* eslint-disable camelcase */
    UNSAFE_componentWillReceiveProps(nextProps) {
      const { nodes: newNodes } = nextProps

      const attributes = newNodes
        .filter((node) => typeof node.attributes !== 'undefined')
        .map((node) => node.attributes)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

      const attributeNames = Object.keys(attributes)
      // function to check if two arrays are equal
      // eslint-disable-next-line func-names
      Array.prototype.equals = function (array) {
        if (!array) return false;
        if (this.length !== array.length) return false;
        for (let i = 0, l = this.length; i < l; i += 1) {
          if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) return false;
          } else if (this[i] !== array[i]) {
            return false;
          }
        }
        return true;
      }
      Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
      // function to take out repeats in an array
      // eslint-disable-next-line func-names
      Array.prototype.unique = function () {
        const a = this.concat();
        for (let i = 0; i < a.length; i += 1) {
          for (let j = i + 1; j < a.length; j += 1) {
            if (a[i] === a[j]) a.splice(j -= 1, 1);
          }
        }
        return a;
      };
      Object.defineProperty(Array.prototype, 'unique', { enumerable: false });

      const newAttributes = previousAttributes.concat(attributeNames).unique()

      if (!previousAttributes.equals(newAttributes)) {
        this.injectCustomAttributes(newNodes)
        previousAttributes = newAttributes
      }
    }

    onSelectionChange = (selection) => {
      this.props.dispatch(selectNodes(selection))
    }

    onOrderChange = (columnOrder) => {
      this.props.dispatch(changeColumnOrder('NodeTable', columnOrder))
    }

    onColumnWidthsChange = (columnWidths) => {
      this.props.dispatch(changeColumnWidths('NodeTable', columnWidths))
    }

    onFiltersChange = (filters) => {
      this.props.dispatch(changeFilters('NodeTable', filters))
    }

    onSortingChange = (sorting) => {
      this.props.dispatch(changeSorting('NodeTable', sorting))
    }

    onEditingRowsChange = (editingRows) => {
      this.props.dispatch(changeEditingRows('NodeTable', editingRows))
    }

    onChangedRowsChange = (changedRows) => {
      this.props.dispatch(changeChangedRows('NodeTable', changedRows))
    }

    onAddedRowsChange = (addedRows) => {
      this.props.dispatch(changeAddedRows('NodeTable', addedRows))
    }

    hiddenColumnsChange = (hiddenColumns) => {
      this.props.dispatch(changeHiddenColumns('NodeTable', hiddenColumns))
    }

    handleEditPassword = (e) => {
      const { dispatch, nodes } = this.props
      const node = nodes.find(({ id: nodeId }) => nodeId === e.currentTarget.id)
      async function onPasswordConfirmed(password, newPassword) {
        return (dispatch(attemptPasswordChange(node.id, password, newPassword)))
      }
      dispatch(openChangePasswordDialog('', `Change Password for Node: ${node.node_name}`, onPasswordConfirmed))
    }

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

    commitChanges = ({ added, changed, deleted }) => {
      const { dispatch, nodes } = this.props
      const names = nodes.map((node) => node.node_name)
      const hosts = nodes.map((node) => node.host)

      const unique = (node) => (!names.includes(node.node_name) && !hosts.includes(node.host))

      if (added) {
        // Handle added nodes
        const newNodes = this.normalizeNodes(added)
        newNodes.forEach((node) => {
          const onPasswordSubmit = (password) => {
            const newnode = { ...node, password }
            dispatch(createNodes([newnode]))
          }
          if (unique(node)) {
            if (typeof node.password === 'undefined') {
              dispatch(openCreatePasswordDialog('Password', `Please enter a password for node: ${node.node_name}`, onPasswordSubmit))
            } else {
              dispatch(createNodes([node]))
            }
          } else {
            dispatch(openDialog(
              'Non-Unique Node',
              'Each node must have a unique name and host.',
              [{ label: 'Close', action: () => dispatch(closeDialog()) }],
              [`Name "${node.node_name}" or host "${node.host}" is already in use.`],
            ))
          }
        }, this)
      }

      if (changed && (undefined !== Object.values(changed)[0])) {
        // Handle change nodes
        let overlap = false
        Object.values(changed).forEach((node) => {
          if (!unique(node)) {
            dispatch(openDialog(
              'Non-Unique Node',
              'Each node must have a unique name and host.',
              [{ label: 'Close', action: () => dispatch(closeDialog()) }],
              [`Name "${node.node_name}" or host "${node.host}" is already in use.`],
            ))
            overlap = true
          }
        })
        if (overlap) { return }
        const nodeIds = Object.keys(changed)
        const changedNodes = nodeIds.map((id) => ({
          ...nodes.find(({ id: nodeId }) => nodeId === id),
          ...changed[id],
        }))
        const updatefunc = (normalizedNodes) => {
          dispatch(closeDialog())
          dispatch(updateNodes(normalizedNodes))
          triggerRulesPush(dispatch, undefined, undefined, undefined, undefined);
        }
        dispatch(openDialog(
          'Update Node',
          'Are you sure you want to modify this node?',
          [{ label: 'Yes, update this node', action: () => updatefunc(this.normalizeNodes(changedNodes)), focused: true },
            { label: 'Close', action: () => dispatch(closeDialog()) }],
          changedNodes.map((node) => node.node_name),
        ))
        // dispatch(updateNodes(this.normalizeNodes(changedNodes)))
      }
      if (deleted) {
        // Handle deleted nodes
        const nodeToDelete = nodes.find(({ id: nodeId }) => nodeId === deleted[0])

        dispatch(openDialog(
          'Delete Node',
          'Are you sure you want to delete this node?',
          [{ label: 'Yes, delete this node', action: () => dispatch(deleteNodes([nodeToDelete])).then(dispatch(closeDialog())), focused: true },
            { label: 'No, Close', action: () => dispatch(closeDialog()) }],
          [nodeToDelete.node_name],
        ))
      }
    }

    injectCustomAttributes = (nodes) => {
      const defaultColumns = [
        { name: 'edit_password', title: 'Edit Password' },
        { name: 'node_name', title: 'Name' },
        { name: 'protocol', title: 'Protocol', dataType: 'disabled' },
        { name: 'host', title: 'Host' },
        { name: 'port', title: 'Port' },
        { name: 'username', title: 'Username' },
        // { name: 'password', title: 'Password', dataType: 'password' },
        { name: 'created_on', title: 'Created On', dataType: 'date' },
        { name: 'updated_on', title: 'Updated On', dataType: 'date' },
      ]

      const defaultColumnOrder = [
        'edit_password',
        'node_name',
        'protocol',
        'host',
        'port',
        'username',
        // 'password',
        'created_on',
        'updated_on',
      ]

      const defaultColumnWidths = [
        { columnName: 'edit_password', width: 140 },
        { columnName: 'node_name', width: 90 },
        { columnName: 'protocol', width: 90 },
        { columnName: 'host', width: 180 },
        { columnName: 'port', width: 90 },
        { columnName: 'username', width: 90 },
        // { columnName: 'password', width: 90 },
        { columnName: 'created_on', width: 180 },
        { columnName: 'updated_on', width: 180 },
      ]

      const attributes = nodes
        .filter((node) => typeof node.attributes !== 'undefined')
        .map((node) => node.attributes)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

      const attributeNames = Object.keys(attributes)
      const columns = [
        ...defaultColumns,
        ...attributeNames.map((name) => ({
          name,
          title: name
            .split('_')
            .map((word) => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
            .reduce((acc, cur) => `${acc} ${cur}`, ''),
          editable: true,
        })),
      ]

      const columnOrder = [
        ...defaultColumnOrder
          .filter((column) => column !== 'created_on' && column !== 'updated_on'),
        ...attributeNames,
        'created_on',
        'updated_on',
      ]
      const columnWidths = defaultColumnWidths.map((col) => {
        const widthsObj = { ...col }
        return widthsObj
      }).concat(attributeNames.map((name) => {
        const widthsObj = { columnName: name, width: 180 }
        return widthsObj
      }))

      const { dispatch } = this.props
      dispatch(changeColumns('NodeTable', columns))
      dispatch(changeColumnOrder('NodeTable', columnOrder))
      dispatch(changeColumnWidths('NodeTable', columnWidths))
    }

    render() {
      return (
        <WrappedComponent
          rows={this.props.flattenedNodes.filter((node) => node.id !== 'home_node')}
          columns={this.props.columns}
          getRowId={getRowId}
          sorting={this.props.sorting}
          filters={this.props.filters}
          editingRows={this.props.editingRows}
          changedRows={this.props.changedRows}
          addedRows={this.props.addedRows}
          columnOrder={this.props.columnOrder}
          columnWidths={this.props.columnWidths}
          hiddenColumns={this.props.hiddenColumns}
          commitChanges={this.commitChanges}
          selection={this.props.selectedNodes}
          onOrderChange={this.onOrderChange}
          onSelectionChange={this.onSelectionChange}
          onColumnWidthsChange={this.onColumnWidthsChange}
          onFiltersChange={this.onFiltersChange}
          onSortingChange={this.onSortingChange}
          onEditingRowsChange={this.onEditingRowsChange}
          onChangedRowsChange={this.onChangedRowsChange}
          onAddedRowsChange={this.onAddedRowsChange}
          hiddenColumnsChange={this.hiddenColumnsChange}
        >
          <DateTypeProvider />
          <DataTypeProvider
            for={['edit_password']}
            formatterComponent={({ value }) => ((value == null || value === undefined)
              ? (<span />)
              : <Button id={value} color="primary" size="small" onClick={this.handleEditPassword}>Edit Password</Button>)}
            editorComponent={({ value }) => ((value == null || value === undefined)
              ? (<span />)
              : <Button id={value} color="primary" size="small" onClick={this.handleEditPassword}>Edit Password</Button>)}
          />
          <DisabledTypeProvider />
        </WrappedComponent>
      )
    }
  }

  const mapStateToProps = (state) => ({
    nodes: getNodes(state),
    flattenedNodes: getFlattenedNodes(state),
    selectedNodes: getSelectedNodes(state),
    columns: state.nodeTable.columns,
    columnOrder: state.nodeTable.columnOrder,
    columnWidths: state.nodeTable.columnWidths,
    hiddenColumns: state.nodeTable.hiddenColumns,
    sorting: state.nodeTable.sorting,
    filters: state.nodeTable.filters,
    editingRows: state.nodeTable.editingRows,
    changedRows: state.nodeTable.changedRows,
    addedRows: state.nodeTable.addedRows,
  })


  return connect(mapStateToProps)(NodeTable)
}

export default tableWithNodes
