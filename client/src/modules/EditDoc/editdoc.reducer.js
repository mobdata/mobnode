import {
  ADD_NODES, ADD_DBS,
  ADD_DOC_INFO, SELECT_DB, ADD_DOC_IDS,
  SELECT_DOC_ID, ADD_HOSTNAME, ADD_FULLHOSTNAME, HANDLE_FIELD_ADDITION, HANDLE_INFO_UPDATE,
  UPDATE_NODE,
} from 'modules/EditDoc'
import { TOGGLE_EDITING_DOC } from './editdoc.actions';
import { INIT_STATE } from './editdoc.actions';
import { AccordionActions } from '@material-ui/core';
  
const initialState = {
  docInfo: {},
  // our known nodes (pulled from md_nodes) which we can push / pull docs from
  nodes: [],
  // the node (from md_nodes) we will be posting docs to, as selected by the user
  host: [],
  // the full hostname + domain of the selected host
  fullHostname: "",
  // the db at our host which we will post to, as currently selected by the user
  db: "",
  // the list of all dbs found at the host that the user input,
  // used to provide Select options for the db text box
  dbs: [],
  // the id of the doc currently selected by the user
  doc_id: "",
  // a list of the ids of all docs found at the db selected by the user, used
  // for validation when the user wants to post a document with a custom id
  doc_ids: [],
  // true if editing doc; false if creating doc; null otherwise
  editingDoc: null,
}
  
const EditDocReducer = (state = initialState, action) => {
  const { type } = action
  
  switch (type) {
  case TOGGLE_EDITING_DOC: //Sets editingtoc to the passed bool
    return {
      ...state, 
      editingDoc: action.editingDoc,
    }
  case ADD_DOC_INFO: // sets docInfo to equal the info passed
    return {
      ...state,
      docInfo: action.docInfo,
    }
  case ADD_NODES: // adds nodes to the nodes array
    const cleanArray = action.nodes
    return {
      ...state,
      nodes: cleanArray
    }
  case ADD_DBS: // adds dbs to the db array
    return {
      ...state,
      dbs: action.dbs,
    }
  case SELECT_DB: // sets db to the passed db
    return {
      ...state,
      db: action.db,
    }
  case ADD_DOC_IDS: // adds doc Ids to array
    return {
      ...state,
      doc_ids: action.doc_ids,
    }
  case SELECT_DOC_ID: // sets docid to the passed string
    return {
      ...state,
      doc_id: action.doc_id,
    }
  case ADD_HOSTNAME: // adds hosname to array
    return {
      ...state,
      hostname: action.hostname,
    }
  case ADD_FULLHOSTNAME: // sets fullhostname to passed string
    return {
      ...state,
      fullHostName: action.fullHostName,
    }
  case INIT_STATE: // reserts all state variables to initial state
    const { host, fullHostname, db, dbs, doc_ids, doc_id, editingDoc } = action.payload
    return {
      ...state,
      host: host,
      fullHostname: fullHostname,
      db: db,
      dbs: dbs,
      doc_ids: doc_ids,
      doc_id: doc_id,
      editingDoc: editingDoc,
    }
  case HANDLE_FIELD_ADDITION: // flattens document if neccesary, then adds new object/text field to docInfo 
    const { prefix, fullName, newFieldType } = action.payload

    return {
      ...state,
      docInfo: Object.assign(Object.keys(state.docInfo).reduce((obj, key) => {
        if (key !== prefix) {
          obj[key] = state.docInfo[key]
    
        } else {
          obj[fullName] = newFieldType === 'Text' ? '' : {}
        }
        return obj
      }, {}), {[fullName]: newFieldType === 'Text' ? '' : {}}), 
    }

  case HANDLE_INFO_UPDATE: // handles imputs to text boxes
    return {
      ...state,
      docInfo: {
        ...state.docInfo, 
        [action.fullName]: action.item,
      },
    }      

  case UPDATE_NODE:
    const obj1 = {alive: action.alive}
    const newArray = [...state.nodes]; //making a new array
    return {
      ...state,
      nodes: newArray.map((node, index) => {
        if (index === action.index) {
          // Copy the object before mutating
          return Object.assign({}, node, obj1)
        }
        return node
      })
    }
  default:
    return state
  }
}
  
export const getEditingDoc = (state) => state.editdoc.editingDoc
export const getDocInfo = (state) => state.editdoc.docInfo
export const getNodes = (state) => state.editdoc.nodes
export const getHost = (state) => state.editdoc.host
export const getFullHostname = (state) => state.editdoc.fullHostname
export const getId = (state) => state.editdoc.doc_id
export const getAllIds = (state) => state.editdoc.doc_ids
export const getDb = (state) => state.editdoc.db
export const getAllDbs = (state) => state.editdoc.dbs

  
export default EditDocReducer
  