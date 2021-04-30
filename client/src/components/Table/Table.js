import React from 'react' // component rendering
import PropTypes from 'prop-types' // prop typechecking

// dx-react-grid provides a bunch of plugins for creating a clean table with lots of functionality
// imports are pretty straightforward w/ regards to what they handle
import {
  SortingState, IntegratedSorting,
  FilteringState, IntegratedFiltering,
  EditingState, SelectionState,
  IntegratedSelection,
} from '@devexpress/dx-react-grid'
import {
  Grid, VirtualTable,
  TableHeaderRow, TableFilterRow, TableEditRow, TableEditColumn,
  TableColumnReordering, DragDropProvider, TableColumnResizing,
  TableSelection, Toolbar, TableColumnVisibility, ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui'
// see guide and docs on dx-react-grid for a more thorough breakdown
// (especially their Plugin Overview)

/* Defines a dx-react-grid based table. Our Table component does not define any of
   its own values, functions, or event handlers, expecting all that as props from the
   code which creates it. It only provides the UI skeleton for the table. */
const Table = (props) => (
  <Grid // base component for making a grid/table with dx-react-grid
    rows={props.rows}
    columns={props.columns}
    getRowId={props.getRowId}
  >
    {props.children}
    { /* State management plugins for data operations (must come BEFORE operation plugins) */}
    <SortingState
      sorting={props.sorting}
      onSortingChange={props.onSortingChange}
    />
    <FilteringState
      filters={props.filters}
      onFiltersChange={props.onFiltersChange}
      columnExtensions={props.filteringStateColumnExtensions}
    />
    <SelectionState
      selection={props.selection}
      onSelectionChange={props.onSelectionChange}
    />
    { /* Data operation plugins */}
    <IntegratedSorting />
    <IntegratedFiltering />
    <IntegratedSelection />
    <EditingState // manages state for data editing
      editingRows={props.editingRows}
      onEditingRowsChange={props.onEditingRowsChange}
      changedRows={props.changedRows}
      onChangedRowsChange={props.onChangedRowsChange}
      addedRows={props.addedRows}
      onAddedRowsChange={props.onAddedRowsChange}
      onCommitChanges={props.commitChanges} // triggers when user finishes editing a value
      columnExtensions={props.editingStateColumnExtensions}
    />
    <DragDropProvider /* visualizes the dragged column when reordering with drag/drop */ />
    <VirtualTable /* makes the table scrollable */ />
    <TableColumnReordering
      order={props.columnOrder}
      onOrderChange={props.onOrderChange}
    />
    <TableColumnResizing // allows adjustment of column widths
      columnWidths={props.columnWidths}
      onColumnWidthsChange={props.onColumnWidthsChange}
    />
    <Toolbar /* renders toolbar components; required for ColumnChooser */ />
    <TableColumnVisibility // manages hidden columns, must come before ColumnChooser
      hiddenColumnNames={props.hiddenColumns}
      onHiddenColumnNamesChange={props.hiddenColumnsChange}
    />
    <ColumnChooser /* allows user to select which columns to hide at runtime */ />
    <TableHeaderRow
      showSortingControls
    />
    <TableEditRow /* renders the row being edited */ />
    <TableEditColumn // provides access to command buttons
      showAddCommand // the NEW row button
      showEditCommand // the EDIT row button
      showDeleteCommand // the DELETE row button
    />
    <TableFilterRow // provides the row which allows the user to filter rows by column value
      showFilterSelector={false} // if true, allows other filter options (e.g. starts with)
    />
    <TableSelection // adds visual display for selected rows
      showSelectAll // adds select all rows button in header
      showSelectionColumn={props.showSelectionColumn} // if true, displays checkbox selection column
    />
  </Grid>
)

// ensure all necessary parameters are present
Table.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  commitChanges: PropTypes.func.isRequired,
  columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getRowId: PropTypes.func.isRequired,
  selection: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  sorting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSortingChange: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteringStateColumnExtensions: PropTypes.arrayOf(PropTypes.shape({})),
  onFiltersChange: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  onColumnWidthsChange: PropTypes.func.isRequired,
  onEditingRowsChange: PropTypes.func.isRequired,
  editingStateColumnExtensions: PropTypes.arrayOf(PropTypes.shape({})),
  onChangedRowsChange: PropTypes.func.isRequired,
  onAddedRowsChange: PropTypes.func.isRequired,
  hiddenColumnsChange: PropTypes.func.isRequired,
  editingRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  changedRows: PropTypes.shape({}).isRequired,
  addedRows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  showSelectionColumn: PropTypes.bool,
}

Table.defaultProps = {
  children: [],
  showSelectionColumn: true,
  filteringStateColumnExtensions: [{ columnName: 'password', filteringEnabled: true }, { columnName: 'edit_password', filteringEnabled: false }],
  editingStateColumnExtensions: [{ columnName: 'password', editingEnabled: true }, { columnName: 'edit_password', editingEnabled: false }],
}

export default Table
