// action names
export const CHANGE_COLUMNS = 'CHANGE_COLUMNS'
export const CHANGE_COLUMN_ORDER = 'CHANGE_COLUMN_ORDER'
export const CHANGE_COLUMN_WIDTHS = 'CHANGE_COLUMN_WIDTHS'
export const CHANGE_HIDDEN_COLUMNS = 'CHANGE_HIDDEN_COLUMNS'
export const CHANGE_SORTING = 'CHANGE_SORTING'
export const CHANGE_FILTERS = 'CHANGE_FILTERS'
export const CHANGE_EDITING_ROWS = 'CHANGE_EDITING_ROWS'
export const CHANGE_ROWS = 'CHANGE_ROWS'
export const ADDED_ROWS = 'ADDED_ROWS'

// all actions correspond directly to some part of the table being updated
// Synchronous actions
export const changeColumns = (tableName, columns) => ({
  type: CHANGE_COLUMNS,
  tableName,
  columns,
})

export const changeColumnOrder = (tableName, columnOrder) => ({
  type: CHANGE_COLUMN_ORDER,
  tableName,
  columnOrder,
})

export const changeColumnWidths = (tableName, columnWidths) => ({
  type: CHANGE_COLUMN_WIDTHS,
  tableName,
  columnWidths,
})

export const changeHiddenColumns = (tableName, hiddenColumns) => ({
  type: CHANGE_HIDDEN_COLUMNS,
  tableName,
  hiddenColumns,
})

export const changeSorting = (tableName, sorting) => ({
  type: CHANGE_SORTING,
  tableName,
  sorting,
})

export const changeFilters = (tableName, filters) => ({
  type: CHANGE_FILTERS,
  tableName,
  filters,
})

export const changeEditingRows = (tableName, editingRows) => ({
  type: CHANGE_EDITING_ROWS,
  tableName,
  editingRows,
})

export const changeChangedRows = (tableName, changedRows) => ({
  type: CHANGE_ROWS,
  tableName,
  changedRows,
})

export const changeAddedRows = (tableName, addedRows) => ({
  type: ADDED_ROWS,
  tableName,
  addedRows,
})
