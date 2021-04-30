import Table from './Table'

// expose all relevant Table functionality
export default Table
export { default as createTableReducer } from './table.reducer'
export {
  CHANGE_COLUMNS,
  CHANGE_COLUMN_ORDER,
  CHANGE_COLUMN_WIDTHS,
  CHANGE_HIDDEN_COLUMNS,
  CHANGE_SORTING,
  CHANGE_FILTERS,
  CHANGE_EDITING_ROWS,
  CHANGE_ROWS,
  ADDED_ROWS,
  changeColumns,
  changeColumnOrder,
  changeColumnWidths,
  changeHiddenColumns,
  changeSorting,
  changeFilters,
  changeEditingRows,
  changeChangedRows,
  changeAddedRows,
} from './table.actions'
