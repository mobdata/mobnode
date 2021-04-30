/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { parse } from '@mobdata/mobdsl'
import Switch from '@material-ui/core/Switch'
import FormControl from '@material-ui/core/FormControl'
import { Select } from '@material-ui/core'
import AddAlertTwoToneIcon from '@material-ui/icons/AddAlertTwoTone'
import {
  DataTypeProvider,
  // EditingState,
} from '@devexpress/dx-react-grid';
// import moment from 'moment'
import _ from 'lodash'

import { openDialog, closeDialog } from 'components/AppDialog'
import {
  getConditions,
  getSelectedConditions,
  fetchConditions,
  selectConditions,
  refreshConditions,
  deleteConditions,
} from 'modules/Conditions'
import {
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
import { fetchMdAttributes } from 'modules/Attributes'

let previousAttributes = ['id', 'rev', '_id', '_rev', 'condition_text', 'on_status']

const getRowId = ({ id: conditionId }) => conditionId

// eslint-disable-next-line react/prop-types
const BooleanFormatter = ({ value }) => (
  // a dead switch displaying whether the condition is on or not
  <Switch
    checked={value}
    disabled
  />
)

// eslint-disable-next-line react/prop-types
const BooleanEditor = ({ value, onValueChange }) => {
  // checks for value to differentiate between component in table versus filter row
  if (typeof (value) === 'boolean') {
    // row component is a switch that controls the value of on_status
    // eslint-disable-next-line react/jsx-one-expression-per-line
    return (
      <Switch
        checked={value}
        onChange={() => onValueChange(!value)}
        disableRipple
      />
    )
  }
  // component for filter row, simple dropdown to choose
  return (
    <form>
      <FormControl>
        <Select
          native
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          inputProps={{
            name: 'on_status',
          }}
        >
          <option value={null} aria-label="No Option" />
          <option value>On</option>
          <option value={false}>Off</option>
        </Select>
      </FormControl>
    </form>
  )
}

const BooleanTypeProvider = () => (
  <DataTypeProvider
    for={['on_status']}
    formatterComponent={BooleanFormatter}
    editorComponent={BooleanEditor}
  />
)

// eslint-disable-next-line react/prop-types
const AlteredFormatter = ({ value }) => {
  if (value) {
    return (
      <AddAlertTwoToneIcon />
    )
  }
  return <span />
}

const AlteredEditor = () => <span />

const AlteredTypeProvider = () => (
  <DataTypeProvider
    for={['altered']}
    formatterComponent={AlteredFormatter}
    editorComponent={AlteredEditor}
  />
)

// GENERAL NOTE ABOUT SELECTION
// We don't use the selection feature in this table, however:
// NodeTable does, and it functionally must be marked .isRequired
// Thus we include these props and funcs to suppress errors until further pruning
const tableWithConditions = (WrappedComponent) => {
  class ConditionTable extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      conditions: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
      selectedConditions: PropTypes.arrayOf(
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
      // eslint-disable-next-line no-console
      const columns = [
        { name: 'condition_text', title: 'Condition Text' },
        { name: 'on_status', title: 'Off/On', dataType: 'boolean' },
        { name: 'altered', title: 'Altered?', dataType: 'boolean' },
      ]

      const columnOrder = [
        'condition_text',
        'on_status',
        'altered',
      ]

      const columnWidths = [
        { columnName: 'condition_text', width: 630 },
        { columnName: 'on_status', width: 90 },
        { columnName: 'altered', width: 90 },
      ]

      const { dispatch } = props

      if (props.columns.length === 0) {
        dispatch(changeColumns('ConditionTable', columns))
      }

      if (props.columnOrder.length === 0) {
        dispatch(changeColumnOrder('ConditionTable', columnOrder))
      }

      if (_.isEmpty(props.columnWidths)) {
        dispatch(changeColumnWidths('ConditionTable', columnWidths))
      }
    }

    componentDidMount() {
      const { conditions } = this.props
      if (conditions.length === 0) {
        this.props.dispatch(fetchConditions())
        this.props.dispatch(fetchMdAttributes())
      }
    }

    /* eslint-disable camelcase */
    UNSAFE_componentWillReceiveProps(nextProps) {
      const { conditions: newConditions } = nextProps

      const attributes = newConditions
        .filter((condition) => typeof condition.attributes !== 'undefined')
        .map((condition) => condition.attributes)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})

      const attributeNames = Object.keys(attributes)
      // function to check if two arrays are equal
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
        this.injectCustomAttributes(newConditions)
        previousAttributes = newAttributes
      }
    }

    onSelectionChange = (selection) => this.props.dispatch(selectConditions(selection))

    onOrderChange = (columnOrder) => {
      this.props.dispatch(changeColumnOrder('ConditionTable', columnOrder))
    }

    onColumnWidthsChange = (columnWidths) => {
      this.props.dispatch(changeColumnWidths('ConditionTable', columnWidths))
    }

    onFiltersChange = (filters) => {
      this.props.dispatch(changeFilters('ConditionTable', filters))
    }

    onSortingChange = (sorting) => {
      this.props.dispatch(changeSorting('ConditionTable', sorting))
    }

    onEditingRowsChange = (editingRows) => {
      this.props.dispatch(changeEditingRows('ConditionTable', editingRows))
    }

    onChangedRowsChange = (changedRows) => {
      this.props.dispatch(changeChangedRows('ConditionTable', changedRows))
    }

    onAddedRowsChange = (addedRows) => {
      this.props.dispatch(changeAddedRows('ConditionTable', addedRows))
    }

    hiddenColumnsChange = (hiddenColumns) => {
      this.props.dispatch(changeHiddenColumns('ConditionTable', hiddenColumns))
    }

    normalizeConditions = (conditions) => {
      // confirms correct formatting and resets rowIds as well as defaults
      const commonAttributes = ['id', 'rev', '_id', '_rev', 'condition_text', 'on_status', 'altered']
      const unformattedConditions = Array.isArray(conditions) ? conditions : [conditions]
      const newConditions = unformattedConditions.map((condition, index) => {
        const entries = Object.entries(condition)
        const attributes = entries
          .filter((entry) => commonAttributes.includes(entry[0]))
          .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
        // eslint-disable-next-line camelcase
        const { condition_text, altered } = condition
        const on_status = condition.on_status !== undefined ? condition.on_status : true

        return {
          ...attributes,
          id: index.toString(),
          condition_text,
          on_status,
          altered,
        }
      })
      return newConditions.sort((a, b) => a.id - b.id)
    }

    commitChanges = ({ added, changed, deleted }) => {
      const { dispatch, conditions } = this.props
      // dummy node for the following parsing test
      const nodes = {
        '000': {
          _id: 'test',
          _rev: '0',
          node_name: '000',
        },
      }

      // function for checking if the new condition text parses with a generic replication rule
      const parsetest = (condition) => {
        if (typeof condition !== 'string') { return 'No condition text passed.' }
        try {
          const parsed = parse(`send "db" to "000" if ${condition.trim()}`, { nodes, _source_node_name: '000' })
          return (parsed.message)
        } catch (error) {
          return error.toString()
        }
      }

      if (added) {
        // Handle an added condition
        // first check for proper syntax
        const condition = added[0].condition_text
        const testresults = parsetest(condition)
        if (testresults) {
          dispatch(openDialog(
            'Syntax Error',
            testresults,
            [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
            [],
          ))
          return
        }
        // convert the selector's value to be normalized
        let on_status
        if (added[0].on_status === 'false') { on_status = false }
        const newCondition = {
          id: 0,
          ...added[0],
          on_status,
          altered: true,
        }
        const newConditions = [newCondition, ...conditions]
        dispatch(refreshConditions(this.normalizeConditions(newConditions), false))
      }

      if (changed) {
        // Handle changed conditions by checking syntax and then fitting into array
        const conditionIds = Object.keys(changed)
        const changedvalue = Object.values(changed)[0]
        // handles the case of opening editor and saving without changes
        if (changedvalue === undefined) {
          return
        }
        if (changedvalue.condition_text) {
          // eslint-disable-next-line no-nested-ternary
          const condition = changedvalue.condition_text
          const testresults = parsetest(condition)
          if (testresults) {
            dispatch(openDialog(
              'Syntax Error',
              testresults,
              [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
              [],
            ))
            return
          }
        }

        // changes values of the correct condition in the local array
        const changedConditions = conditions.map((condition) => {
          if (conditions.indexOf(condition) === parseInt(conditionIds[0], 10)) {
            const fixed = {
              condition_text: condition.condition_text,
              on_status: condition.on_status,
              ...changedvalue,
              altered: true,
            }
            return fixed
          }
          return {
            condition_text: condition.condition_text,
            on_status: condition.on_status,
            altered: condition.altered,
          }
        })
        dispatch(refreshConditions(this.normalizeConditions(changedConditions), false))
      }

      if (deleted) {
        // Handle deleted conditions
        // eslint-disable-next-line max-len
        const remainingConditions = conditions.filter((condition) => condition.id !== deleted[0])
        console.log("curious if this code ever gets hit")
        dispatch(deleteConditions(this.normalizeConditions(remainingConditions)))
      }
    }

    render() {
      return (
        <WrappedComponent
          rows={this.props.conditions}
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
          selection={this.props.selectedConditions}
          onOrderChange={this.onOrderChange}
          onSelectionChange={this.onSelectionChange}
          onColumnWidthsChange={this.onColumnWidthsChange}
          onFiltersChange={this.onFiltersChange}
          onSortingChange={this.onSortingChange}
          onEditingRowsChange={this.onEditingRowsChange}
          onChangedRowsChange={this.onChangedRowsChange}
          onAddedRowsChange={this.onAddedRowsChange}
          hiddenColumnsChange={this.hiddenColumnsChange}
          showSelectionColumn={false}
        >
          <BooleanTypeProvider />
          <AlteredTypeProvider />
        </WrappedComponent>
      )
    }
  }

  const mapStateToProps = (state) => ({
    conditions: getConditions(state),
    selectedConditions: getSelectedConditions(state),
    columns: state.conditionTable.columns,
    columnOrder: state.conditionTable.columnOrder,
    columnWidths: state.conditionTable.columnWidths,
    hiddenColumns: state.conditionTable.hiddenColumns,
    sorting: state.conditionTable.sorting,
    filters: state.conditionTable.filters,
    editingRows: state.conditionTable.editingRows,
    changedRows: state.conditionTable.changedRows,
    addedRows: state.conditionTable.addedRows,
    showSelectionColumn: state.conditionTable.showSelectionColumn,
  })


  return connect(mapStateToProps)(ConditionTable)
}

export default tableWithConditions
