export const TOGGLE_EDITING_DOC = 'TOGGLE_EDITING_DOC'

export const INIT_STATE = 'INITIAL STATE'

export const ADD_HOSTNAME = 'ADD_HOSTNAME'
export const ADD_FULLHOSTNAME = 'ADD_FULLHOSTNAME'
export const ADD_DOC_IDS = 'ADD_DOC_IDS'
export const ADD_DOC_INFO = 'ADD_DOC_INFO'
export const ADD_NODES = 'ADD_NODES'
export const ADD_DBS = 'ADD_DBS'

export const SELECT_DOC_ID = 'SELECT_DOC_ID'
export const SELECT_DB = 'SELECT_DB'
export const HANDLE_FIELD_ADDITION = "HANDLE_FIELD_ADDITION"
export const HANDLE_INFO_UPDATE = "HANDLE_INFO_UPDATE"
export const HANDLE_OBJ_DELETION = "HANDLE_OBJ_DELETION"
export const UPDATE_NODE = "UPDATE_NODE"


// Synchronous functions
export const addNodes = (nodes) => ({
  type: ADD_NODES,
  nodes,
})

export const toggleEditingDoc = (editingDoc) => ({
  type: TOGGLE_EDITING_DOC,
  editingDoc,
})

export const addHostname = (hostname) => ({
  type: ADD_HOSTNAME,
  hostname,
})

export const addFullHostname = (fullHostname) => ({
  type: ADD_FULLHOSTNAME,
  fullHostname,
})

export const addDocIds = (doc_ids) => ({
  type: ADD_DOC_IDS,
  doc_ids,
})

export const addDocInfo = (docInfo) => ({
  type: ADD_DOC_INFO,
  docInfo,
})

export const selectDocId = (doc_id) => ({
  type: SELECT_DOC_ID,
  doc_id,
})

export const selectDb = (db) => ({
  type: SELECT_DB,
  db,
})

export const addDbs = (dbs) => ({
  type: ADD_DBS,
  dbs,
})

export const updateNode = (index, alive) => ({
  type: UPDATE_NODE,
  index,
  alive,
})

export const initState = ( host, fullHostname, db, dbs, doc_ids, doc_id, editingDoc) => ({ 
  type: INIT_STATE,
  payload: {
    host: host, 
    fullHostname: fullHostname, 
    db: db, 
    dbs: dbs,
    doc_ids: doc_ids, 
    doc_id: doc_id,
    editingDoc: editingDoc,
  }
})

export const handleFieldAddition = (prefix, fullName, newFieldType) => ({
  type: HANDLE_FIELD_ADDITION,
  payload: {
    prefix: prefix,
    fullName: fullName,
    newFieldType: newFieldType,
  }
    
})

export const handleInfoUpdate = (item, fullName) => ({
  type: HANDLE_INFO_UPDATE,
  item,
  fullName,
})

