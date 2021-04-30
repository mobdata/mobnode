import EditDocPage from 'modules/EditDoc/EditDocPage'
// expose EditDocPage for importing elsewhere
export default EditDocPage

export {
  TOGGLE_EDITING_DOC,
  ADD_HOSTNAME,
  ADD_FULLHOSTNAME,
  ADD_DOC_IDS,
  ADD_DOC_INFO, 
  ADD_NODES, 
  ADD_DBS, 
  SELECT_DOC_ID,
  SELECT_DB,
  HANDLE_FIELD_ADDITION,
  HANDLE_INFO_UPDATE,
  INIT_STATE,
  UPDATE_NODE,
  addNodes,
  toggleEditingDoc,
  addHostname,
  addFullHostname,
  addDocIds,
  addDocInfo,
  selectDocId,
  selectDb,
  addDbs,
  initState,
  handleFieldAddition,
  handleInfoUpdate,
  updateNode,
} from 'modules/EditDoc/editdoc.actions'

  
export {
  default as EditDocReducer,
  getEditingDoc,
  getDocInfo,
  getNodes,
  getHost,
  getFullHostname,
  getId,
  getAllIds,
  getDb,
  getAllDbs,
} from 'modules/EditDoc/editdoc.reducer'
  