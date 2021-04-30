import { // import action names
  CHANGE_COLUMNS,
  CHANGE_COLUMN_ORDER,
  CHANGE_COLUMN_WIDTHS,
  CHANGE_HIDDEN_COLUMNS,
  CHANGE_SORTING,
  CHANGE_FILTERS,
  CHANGE_EDITING_ROWS,
  CHANGE_ROWS,
  ADDED_ROWS,
} from 'components/Table'

// default to an empty table prior to load
const initialState = {
  columns: [],
  columnOrder: [],
  columnWidths: [],
  hiddenColumns: [],
  sorting: [],
  filters: [],
  editingRows: [],
  addedRows: [],
  changedRows: {},
}

const createTableReducer = (tableName = '') => (state = initialState, action) => {
  const { type } = action
  // verify this action was meant for this table
  if (action.tableName !== tableName) { return state }

  switch (type) {
  // all table update actions simply require the changes to be passed through to the store
  case CHANGE_COLUMNS:
    return { ...state, columns: action.columns }
  case CHANGE_COLUMN_ORDER:
    return { ...state, columnOrder: action.columnOrder }
  case CHANGE_COLUMN_WIDTHS:
    return { ...state, columnWidths: action.columnWidths }
  case CHANGE_HIDDEN_COLUMNS:
    return { ...state, hiddenColumns: action.hiddenColumns }
  case CHANGE_SORTING:
    return { ...state, sorting: action.sorting }
  case CHANGE_FILTERS:
    return { ...state, filters: action.filters }
  case CHANGE_EDITING_ROWS:
    return { ...state, editingRows: action.editingRows }
  case CHANGE_ROWS:
    return { ...state, changedRows: action.changedRows }
  case ADDED_ROWS:
    return { ...state, addedRows: action.addedRows }
  default:
    return state
  }
}

export default createTableReducer
