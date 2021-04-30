import React, { Component } from 'react'; // building blocks
import { connect } from 'react-redux'
import PropTypes from 'prop-types' // ensures that props get proper values
import regeneratorRuntime from "regenerator-runtime";
import { // UI elements
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
  withStyles, Divider, FormHelperText, IconButton, Modal,
  FormControlLabel, RadioGroup, Radio, ClickAwayListener, Tooltip
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete' // trash can icon
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone' //plus icon


import {
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
} from 'modules/EditDoc/'

import {
  getEditingDoc,
  getDocInfo,
  getNodes,
  getHost,
  getFullHostname,
  getId,
  getAllIds,
  getDb,
  getAllDbs,
} from 'modules/EditDoc/'

const styles = {
  // window that appears when adding a new field to the opened doc
  newFieldModal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    minWidth: 240,
    maxWidth: 600,
    backgroundColor: 'white',
    border: '2px solid #222222',
    borderRadius: '4px',
    paddingLeft: 4,
    paddingRight: 4,
  },
  // the bubble which encloses a displayed object
  objContainer: {
    border: '1px solid #dddddd',
    borderRadius: '4px',
    margin: 10,
    position: 'relative',
    display: 'inline-grid',
    gridTemplateColumns: 'auto auto',
    gridTemplateRows: 'auto auto',
    justifyItems: 'start',
    alignItems: 'center',
    //minWidth: 120,
  },
  // contians text feild and text feild delete buttons
  textFieldContainer: {
    borderRadius: '1px',
    display: 'inline-grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
    justifyItems: 'flex-start',
  },
  // container for text feild delete buttons, not object delete buttons
  deleteContainer: {
    position:'relative',
    left: '-20px',
    marginRight: 20,
    display:'inline',
  },
  // contains the add and delete buttons for objects
  objectControlsContainer: {
    border: '1px solid #dddddd',
    borderRadius: '2px',
    margin: 10,
    position:'relative',
    display: 'inline',
  },
  // 
  floatingAdd: {
    position: 'relative',
    display: 'inline',

  },
  // label for a displayed object, used in tandem with objContainer
  borderLabel: {
    top: -12,
    left: 20,
    backgroundColor: 'white',
    position: 'absolute',
    paddingLeft: 4,
    paddingRight: 4,
    fontFamily: 'Helvetica Neue',
  },
  // container for centered groups of elements
  centeredDiv: {
    display: 'flex',
    justifyContent: 'center',
    margin: 4,
    flexWrap: 'wrap',
  },
  // hacky way to create a line break when using a flexbox like centeredDiv
  lineBreak: {
    flexBasis: '100%',
    height: 0,
  },
  // basic spacing properties for any Selects/Textfields
  formField: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 14,
    marginBottom: 10,
    minWidth: 140,
  },
  formButton: {
    margin: 2,
  },
  // spacer style (generally used with Dividers)
  dividerBar: {
    marginTop: 10,
    marginBottom: 10,
    width: '75%',
  },
  // defines special effects for required fields on our form
  requiredField: {
    borderColor: '#0020ee',
  },
};


// flattens objects containing nested elements into a single level object
// e.g. foo: { bar: {a: 'a', b: 'b'}, c: 'c'} becomes foo: { bar.a: 'a', bar.b: 'b', c: 'c'}
function flatten(data) {
  const result = {};
  function recurse(cur, propName) {
    // true if cur is neither an Object nor Array
    if (Object(cur) !== cur) {
      result[propName] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      // for each element of the array, run recurse with propName prepended
      for (let i = 0; i < l; i += 1) recurse(cur[i], propName ? `${propName}.${i}` : `${i}`);
      if (l === 0) result[propName] = [];
    } else {
      let isEmpty = true;
      // run recurse with propName prepended for any keys
      Object.keys(cur).forEach((p) => {
        isEmpty = false;
        recurse(cur[p], propName ? `${propName}.${p}` : p);
      })
      if (isEmpty) result[propName] = {};
    }
  }
  recurse(data, '');
  return result;
}

// unpacks flattened objects into their original nested format
// e.g. foo: { bar.a: 'a', bar.b: 'b', c: 'c'} becomes foo: { bar: {a: 'a', b: 'b'}, c: 'c'}
function unflatten(data) {
  // only allow objects to be unflattened, return all else
  if (Object(data) !== data || Array.isArray(data)) return data;
  const result = {}; let cur; let propName; let idx; let last; let
    temp;
  Object.keys(data).forEach((p) => {
    cur = result; propName = ''; last = 0;
    do {
      idx = p.indexOf('.', last);
      temp = p.substring(last, idx !== -1 ? idx : undefined);
      // eslint-disable-next-line
      cur = cur[propName] || (cur[propName] = (!isNaN(parseInt(temp, 10)) ? [] : {}));
      propName = temp;
      last = idx + 1;
    } while (idx >= 0);
    cur[propName] = data[p];
  })
  return result[''];
}

// handle different classification formats, e.g. "TOP_SECRET" and "Top Secret"
function unifyClassification(classification) {
  return classification.replace(/\s+/g, '_').toLowerCase()
}

// checks if an Object has any props (solely used to check if docInfo is unset, i.e. {})
function isObjEmpty(obj) {
  return obj === undefined
          || Object.keys(obj).every((key) => !Object.prototype.hasOwnProperty.call(obj, key))
}

// covers state props that should reset depending on user's form activity;
// declared as a function rather than object in constructor to avoid directing object references
// in state to objects in defaultState, which can lead to the defaultState being altered
function defaultState() {
  // VESTIGIAL initState();
  return {
    // controls whether to show the field-adding modal; modal displayed when true
    makingNewField: false,
    // type of field to be added; current options are Text | Object
    newFieldType: 'Text',
    // name of the field to be added
    newFieldName: '',
    // holds any object-prefix needed for nested fields
    newFieldPrefix: '',
    // holds the id of the element which initiated a deletion operation,
    // used for validation when determining what to delete and when ClickAway occurs
    deletionTarget: '',

    documentsLoading: false,

    databasesLoading: false,
  }
}

class EditDocPage extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      // enforce that all needed styles are present
      // withStyles returns a HOC where the classes prop contains the string names of our CSS styles
      newFieldModal: PropTypes.string.isRequired,
      objContainer: PropTypes.string.isRequired,
      borderLabel: PropTypes.string.isRequired,
      centeredDiv: PropTypes.string.isRequired,
      lineBreak: PropTypes.string.isRequired,
      formField: PropTypes.string.isRequired,
      formButton: PropTypes.string.isRequired,
      dividerBar: PropTypes.string.isRequired,
      requiredField: PropTypes.string.isRequired,
    }).isRequired,
    editingDoc: PropTypes.bool,
    docInfo: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ),
    nodes: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ),
    host: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ),
    fullHostname: PropTypes.string.isRequired,
    doc_id: PropTypes.string.isRequired,
    doc_ids: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ),
    db: PropTypes.string.isRequired, 
    dbs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    // list of classifications, used as options for any
    // classification Select
    this.classifications = [
      'Unclassified',
      'Confidential',
      'Secret',
      'Top Secret',
      'Top Secret//SI',
      'Top Secret//SI/A',
      'Top Secret//SI/B-C',
      'Top Secret//SI/B-C D',
      'Top Secret//SI//REL TO USA',
      'Top Secret//SI//REL TO USA, GBR',
      'Top Secret//SI//REL TO USA, AUS, CAN, GBR, NZL',
      'Top Secret//SI//NOFORN',
    ]
    // list of reserved fieldnames which cannot be used as new field names in the base doc
    // (or edited if they are preexisting fields)
    this.reservedFields = [
      '_rev',
      'created_on',
      'updated_on',
      'node_name',
      '_id',
    ]
    // extra props here are those which shouldn't return to default until page refresh
    this.state = {
      ...defaultState(),
      nodePoll: null,
      // Date for last time we updated our list of dbs; used to only allow newest updates
      lastHostUpdate: null,
      // Date for last time we updated out list of nodes; used to only allow newest updates
      lastNodeUpdate: null,
    }
  }

  // immediately do a fetch for known hosts on mount, set up a liveness poll
  async componentDidMount() {
    this.nodeFetch()
    this.setState({
      nodePoll: setInterval(this.pokeNodes, 20000),
    })
  }

  // clear liveness poll on unmount
  componentWillUnmount() {
    clearInterval(this.state.nodePoll)
  }

  // fetches list of known hosts from md_nodes and initiates liveness check
  // Note: host list may update *before* all liveness checks are complete
  nodeFetch = async () => {
    const startTime = new Date();
    const res = await fetch('/api/nodes');
    const nodes = await res.json()
    // if there's an error, we'll get an object that contains { ok: false }
    if ((!Object.prototype.hasOwnProperty.call(nodes, 'ok') || nodes.ok)
    && !Object.prototype.hasOwnProperty.call(nodes, 'errno')
    && !Object.prototype.hasOwnProperty.call(nodes, 'error')) {
      //if there are no nodes, add nodes
      if(this.props.nodes.length === 0) {
        this.props.dispatch(addNodes(nodes.rows));
      }
      
      // update if start time over last node update time, and page should not be loading  dbs
      if((startTime > this.state.lastNodeUpdate) && (this.props.host && !(this.props.dbs))) {
        const newNodes = await this.checkNodeLiveness(nodes.rows)
      }
      
      this.setState((prevState) => (startTime > prevState.lastNodeUpdate
        ? { ...prevState, lastNodeUpdate: startTime }
        : { ...prevState }));
    }
  }

  // checks and updates node liveness for known hosts
  pokeNodes = async () => {
    if(!(this.state.documentsLoading) && !(this.state.databasesLoading)){
      const nodes = await this.checkNodeLiveness(this.props.nodes)
    }
    
  }

  // makes a basic call to each host in nodeList and updates liveness based on successful return
  checkNodeLiveness = async (nodeList) => {
    const nodes = nodeList
    nodes.forEach(async (host, index) => {
      const pokeRes = await fetch(`/api/poke/${host.host}`)
      const info = await pokeRes.json()
      const alive = ((!Object.prototype.hasOwnProperty.call(info, 'ok') || info.ok)
                      && !Object.prototype.hasOwnProperty.call(info, 'errno')
                      && !Object.prototype.hasOwnProperty.call(info, 'error'))
      if(alive !== host.alive) {
        this.props.dispatch(updateNode(index, alive))
      }
      
      
    })
    return nodes
  }

  // generic handler for state updates via Textfields --
  // expects id of field to match state prop name
  handleChange = (event) => {
    const { id, value } = event.target;
    if(id === "doc_id") {
      this.props.dispatch(selectDocId(value))
    } else {
      this.setState({
        [id]: value,
      });
    }
    
  }

  // generic handler for updates to any doc fields
  updateDoc = async (event, fieldName) => {
    event.persist()
    this.props.dispatch(handleInfoUpdate( event.target.value, fieldName ))
  }

  // handler which resets the status of having the confirm deletion button open
  // when user clicks away from the delete button
  resetDeletionStatus = (deleter) => {
    // only reset if the clickAway fired from the corresponding listener
    if (deleter === this.state.deletionTarget) {
      this.setState({ deletionTarget: '' })
    }
  }

  // handler for delete button click which triggers the confirm button to render
  initiateDeletion = (event) => {
    this.setState({ deletionTarget: event.currentTarget.id })
  }

  // handler for field delete button clicks
  handleDeletion = (fieldName) => {
    const { docInfo } = this.props;


    const newInfo = unflatten(docInfo).filter(item => item !== fieldName);


    this.props.dispatch(addDocInfo(flatten(newInfo)))


  }

  // handler for object delete button clicks
  handleObjDeletion = (objName) => {
    const { docInfo } = this.props
    const preservedFields = {} // anything from docInfo we want to keep

    let childrenCount = 0;

    const prefixIndex = (objName).lastIndexOf(".")
    const prefix = objName.slice(0, prefixIndex)

    // given an object with name outerObject.myObject, only preserve props that
    // don't have that path (e.g. outerObject.myObject.name would not be saved)
    Object.keys(docInfo).forEach((fieldName) => {
      // need to also check the exact name for empty objects
      if(fieldName.includes(prefix)) { childrenCount++ }
      if (fieldName !== objName
        && fieldName.slice(0, objName.length + 1) !== `${objName}.`) {
        preservedFields[fieldName] = docInfo[fieldName]
      }
    })
    this.props.dispatch(addDocInfo(preservedFields))
    if(childrenCount === 1) {
      const newPrefixIndex = prefix.lastIndexOf(".")
      let newPrefix = "";
      if(newPrefixIndex !== -1) {
        newPrefix = prefix.slice(0, newPrefixIndex - 1)
      }
      this.props.dispatch(handleFieldAddition(newPrefix, prefix, {}))
    }
    this.setState(() => {
      return {
        deletionTarget: '',
      }
    });
    
  }

  // handler for adding a field to the opened document
  handleAddition = () => {
    if (!this.checkValidFieldName()) {
      // eslint-disable-next-line
      alert('The provided field name is invalid.');
      return;
    }
    const { newFieldName, newFieldType, newFieldPrefix } = this.state

    // add object prefix if present since our docInfo is already flattened
    const fullName = newFieldPrefix ? `${newFieldPrefix}.${newFieldName}` : newFieldName

    this.props.dispatch(handleFieldAddition(newFieldPrefix, fullName, newFieldType))
    

    this.handleModalClose()
  }

  // set modal elements to defaults on close
  handleModalClose = () => {
    this.setState({
      makingNewField: false, // triggers the actual closing of the modal
      newFieldPrefix: '',
      newFieldName: '',
      newFieldType: 'Text',
    })
  }

  // handles selection of host, which triggers a fetch for dbs
  handleHostInput = async (event) => {
    const host = this.props.nodes.filter((node) => { return node.node_name === event.target.value})
    const { editingDoc, docInfo } = this.props
    const newState = { host: host[0], fullHostname: host[0].host, editingDoc: editingDoc, doc_id: this.props.doc_id }
    if (!editingDoc) {
      newState.docInfo = docInfo
    }
    this.resetState(newState)
    if (host) {
      this.setState({databasesLoading: true})
      this.dbUpdate(host[0].host)
    }
  }

  // handles selection of db, which triggers a fetch for docs
  handleDbInput = async (event) => {
    const newDb = event.target.value
    if (newDb !== this.props.db) {
      const {
        host, nodes, fullHostname, dbs, docInfo, editingDoc, doc_id
      } = this.props
      const newState = {
        host: host, nodes, fullHostname: fullHostname, dbs: dbs, db: newDb, 
        editingDoc: editingDoc, doc_id: doc_id,
      }
      if (!editingDoc) {
        newState.docInfo = docInfo
      }
      this.resetState(newState);
      // save ourselves a fetch if the new db is blank
      if (newDb) {
        this.setState({documentsLoading: true})
        this.docsUpdate({ fullHostname, db: newDb })
      }
    }
  }

  // fetches list of dbs from the currently selected host
  dbUpdate = async (hostname) => {
    const startTime = new Date();
    const res = await fetch(`/api/${hostname}/dbs`);
    const dbs = await res.json();
    // if there's an error, we should get an object that contains { ok: false }
    if ((!Object.prototype.hasOwnProperty.call(dbs, 'ok') || dbs.ok)
    && !Object.prototype.hasOwnProperty.call(dbs, 'errno')
    && !Object.prototype.hasOwnProperty.call(dbs, 'error')) {
      // JSON comes back as an object with just the dbs array in it
      if(startTime > this.state.lastHostUpdate) { this.props.dispatch(addDbs(dbs.dbs)) }
      this.setState((prevState) => (startTime > prevState.lastHostUpdate
        ? { ...prevState, lastHostUpdate: startTime }
        : { ...prevState }));
    } else {
      // empty out our dbs if there was an issue with the fetch
      if(startTime > this.state.lastHostUpdate) { this.props.dispatch(addDbs([])) }
      this.setState((prevState) => (startTime > prevState.lastHostUpdate
        ? { ...prevState, lastHostUpdate: startTime }
        : { ...prevState }));
    }

    this.setState({databasesLoading: false})
  }

  // fetches list of docs from the currently selected host/db
  // stateView is a snapshot of the state taken when the handler calling this function was called
  docsUpdate = async (stateView) => {
    const {
      fullHostname, db,
    } = stateView
    const res = await fetch(`/api/${fullHostname}/${db}/docs`);
    const docs = await res.json();
    // if there's an error, we'll get an object that contains { ok: false }
    if ((!Object.prototype.hasOwnProperty.call(docs, 'ok') || docs.ok)
    && !Object.prototype.hasOwnProperty.call(docs, 'errno')) {
      // in the JSON response the _id field is renamed id

      const doc_ids = docs.docs.rows.map((doc) => doc.id)
      
      this.props.dispatch(addDocIds(doc_ids))
    }

    this.setState({documentsLoading: false})
  }

  // fetches the doc selected by the user when editing
  populateDoc = async (event) => {
    const newDoc = event.target.value
    if (this.props.doc_id !== newDoc) {
      const { fullHostname, db } = this.props
      const res = await fetch(`/api/${fullHostname}/${db}/docs/${newDoc}`);
      const docFields = await res.json();
      // if there's an error, we'll get an object that contains { ok: false }
      if ((!Object.prototype.hasOwnProperty.call(docFields, 'ok') || docFields.ok)
      && !Object.prototype.hasOwnProperty.call(docFields, 'errno')) {
        const newInfo = flatten(docFields.docFields)
        // fix any classification discrepancies before we update our doc info
        const infoProps = Object.keys(newInfo)
        let suffix
        for (let i = 0; i < infoProps.length; i += 1) {
          suffix = infoProps[i].split('.')
          suffix = suffix[suffix.length - 1]
          if (suffix === 'classification') {
            newInfo[infoProps[i]] = this.findClassification(newInfo[infoProps[i]])
          }
        }
        this.props.dispatch(selectDocId(newDoc))
        this.props.dispatch(addDocInfo(flatten(newInfo)))
      }
    }
  }

  // handler for creation that checks if the user's doc is valid, then posts the new doc if so
  handleSubmit = async () => {
    let errorMsg = ''
    // figure out if any required fields had problems and try to provide nice output
    if (!this.props.host) {
      errorMsg = '"Host"'
    }
    if (!this.props.dbs.includes(this.props.db)) {
      errorMsg = errorMsg ? errorMsg.concat(' | "Database"') : '"Database"'
    }
    console.log("about to call checkValidId.  Here is the docId: " + this.props.doc_id);
    if (!this.checkValidId()) {
      errorMsg = errorMsg ? errorMsg.concat(' | "Document ID"') : '"Document ID"'
    }
    // if our errorMsg isn't blank, something is wrong and we shouldn't fetch
    if (errorMsg !== '') {
      // eslint-disable-next-line
      alert('Error found in required field(s): '.concat(errorMsg));
      return;
    }

    // pull elements of state out here so that we are consistent with our
    // targets for our submit and refresh fetches
    const {
      // eslint-disable-next-line camelcase
      doc_id, host, fullHostname, db, dbs, docInfo,
    } = this.props

    // gather up our information to send off to database db at the given host
    const body = JSON.stringify({
      doc: {
        _id: doc_id,
        ...unflatten(docInfo),
      },
      node_name: host.node_name,
      host: fullHostname,
      db,
      id: doc_id
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };

    // attempt to create the doc
    const res = await fetch('/api/createdoc', options);
    if (res.status === 200 || res.status === 201) {
      this.resetState({
        host: host, fullHostname: fullHostname, dbs: dbs, db: db, docInfo: docInfo,
      });
      // have to fetch docs again to get the new id in case it was autogenerated
      this.docsUpdate({ fullHostname, db })
      // eslint-disable-next-line
      alert('Document created!');
    } else if (res.status === 400) {
      // eslint-disable-next-line
      alert('Failed to create document. The selected database is missing the required update function.');
    } else if (res.status === 401) {
      alert('Failed to create document. The database update function failed to compile.');
    } else {
      alert('Failed to create document.')
    }
  }

  // handler for editing that checks if the user's input is valid, then posts the updated doc if so
  handleEditSubmit = async () => {
    let errorMsg = ''
    // check for valid input in fields, and make the error message clear
    Object.keys(this.props.docInfo).forEach((fieldName) => {
      if (!this.checkDoc(fieldName)) {
        errorMsg = errorMsg ? errorMsg.concat(` | "${fieldName}"`) : `"${fieldName}"`
      }
    })
    // if our errorMsg isn't blank, something is wrong and we shouldn't fetch
    if (errorMsg !== '') {
      // eslint-disable-next-line
      alert('Error found in required field(s): '.concat(errorMsg));
      return;
    }

    // gather up our information to send off to database db at the given host
    const body = JSON.stringify({
      node_name: this.props.host.node_name,
      host: this.props.fullHostname,
      db: this.props.db,
      doc: unflatten(this.props.docInfo),
      id: this.props.doc_id
    });
    // setup for our call to the api
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    };

    // triggers actual POST under the hood, and should return the created doc with a 200 status
    const res = await fetch('/api/createdoc', options);
    if (res.status === 200 || res.status === 201) {
      // eslint-disable-next-line
      alert('Document created!');
      // we've just updated our doc, so we need to get the new _rev so we can post again
      const { fullHostname, db, doc_id } = this.props
      const refreshRes = await fetch(`/api/${fullHostname}/${db}/docs/${doc_id}`);
      const docFields = await refreshRes.json();
      // if there's an error, we'll get an object that contains { ok: false }
      if ((!Object.prototype.hasOwnProperty.call(docFields, 'ok') || docFields.ok)
      && !Object.prototype.hasOwnProperty.call(docFields, 'errno')) {
        this.props.dispatch(addDocInfo(flatten(docFields.docFields)))
      }
    } else {
      // eslint-disable-next-line
      alert('Failed to create document.');
    }
  }

  // on form swap, fetch nodes from md_nodes on host and reset most state fields
  handleFormSwap = async (editStatus) => {
    if (editStatus) {
      this.resetState({ editingDoc: editStatus, docInfo: false})
    } else {
      // add some default fields for the create doc form
      const defaultNewDocFields = { md_attributes: { classification: '', company: '' }, title: '', content: '' }
      this.resetState({ docInfo: defaultNewDocFields, editingDoc: editStatus })
    }
  }

  // utility function to empty out our state while keeping preservedParams
  resetState = (preservedParams = {}) => {
    // When we reset our state, we build the new state following these steps:
    // 1. Start with the previous state. (ensure everything has a value)
    // 2. Overwrite the values for any props which have defaults in our defaultState.
    //    (assume we want to reset everything that could be reset)
    // 3. Overwrite the values for any props provided in preservedParams. (prevent
    //    any props we want to carry over from being reset)

    if (preservedParams.docInfo === false && preservedParams.editingDoc === true) {
      this.props.dispatch(addDocInfo({})) 
    } else if (preservedParams.docInfo) { this.props.dispatch(addDocInfo(flatten(preservedParams.docInfo))) }
    this.props.dispatch(initState(
      preservedParams.host ? preservedParams.host : [],
      preservedParams.fullHostname ? preservedParams.fullHostname : '',
      preservedParams.db ? preservedParams.db : '',
      preservedParams.dbs ? preservedParams.dbs : [],
      preservedParams.doc_ids ? preservedParams.doc_ids : [],
      preservedParams.doc_id ? preservedParams.doc_id : '',
      preservedParams.editingDoc,
    ))
    this.setState((prevState) => ({
      ...prevState,
      ...defaultState(),
      ...preservedParams,
    }));
  }

  // handler used in document creation to check if provided id is valid
  checkValidId = (outputType = 'bool') => {
    const type = outputType.toLowerCase()
    // check for text output vs bool output -- former is for errors messages,
    // latter is for validation
    const textReturn = (type === 'string' || type === 'text')
    // check if they even set the host
    if (!this.props.host) {
      return textReturn ? 'Host is required' : false
    }
    // check if the db has been set yet
    if (!this.props.db) {
      return textReturn ? 'Database is required' : false
    }
    // check if a doc with the given id is already present
    if (this.props.doc_ids.includes(this.props.doc_id)) {
      return textReturn ? 'A document with the chosen id already exists' : false
    }
    // whitelist empty id before content checks (gets autogenerated later if empty)
    if (this.props.doc_id === '') {
      return textReturn ? 'id will be autogenerated' : true
    }
    // check for valid id characters in id
    if (!(/^[a-zA-Z0-9_]+$/.test(this.props.doc_id))) {
      return textReturn ? 'Only letters, numbers, and underscores are valid' : false
    }
    // _design is forbidden
    if (/^_design$/.test(this.props.doc_id)) {
      return textReturn ? '_design is reserved for design docs' : false
    }
    // no problems to report
    return textReturn ? '' : true
  }

  // handles validation checks for all possible fields in a doc during editing
  checkDoc = (fieldName, outputType = 'bool') => {
    let suffix = fieldName.split('.')
    suffix = suffix[suffix.length - 1]
    const type = outputType.toLowerCase()
    // check for text output vs bool output -- former is for errors messages,
    // latter is for validation
    const textReturn = (type === 'string' || type === 'text')
    if (suffix === 'classification') {
      if (!this.findClassification(this.props.docInfo[fieldName])) {
        return textReturn ? 'Classification not recognized' : false
      }
    }
    return textReturn ? '' : true
  }

  checkValidFieldName = (outputType = 'bool') => {
    const type = outputType.toLowerCase()
    // check for text output vs bool output -- former is for errors messages,
    // latter is for validation
    const textReturn = (type === 'string' || type === 'text')
    // check if they even set the host
    if (this.reservedFields.includes(this.state.newFieldPrefix + this.state.newFieldName)) {
      return textReturn ? 'This is a reserved field name and cannot be used.' : false
    }
    if (this.state.newFieldName === '') {
      return textReturn ? 'The field name cannot be blank.' : false
    }
    return textReturn ? '' : true
  }

  /* eslint-disable react/sort-comp */

  // matches a classification to one of our known ones and returns the match if found
  findClassification(classification) {
    const simplifiedClassification = unifyClassification(classification);
    for (let i = 0; i < this.classifications.length; i += 1) {
      const knownClassification = unifyClassification(this.classifications[i]);
      if (knownClassification === simplifiedClassification) {
        return this.classifications[i];
      }
    }
    return ''
  }

  // turns our flattened object representing our document into a full form
  // and returns this result (to keep our render function a little cleaner)
  expandedDoc(classes) {
    // start by regenerating our original doc structure
    const allInfo = unflatten(this.props.docInfo)
    // ensure the doc has been selected/populated; otherwise return nothing
    if (!isObjEmpty(allInfo)) {
      return this.unroll('', allInfo, classes)
    }
    return (<span />);
  }

  // recursively unpacks currObj into its fields and calls expandField to generate UI
  unroll(prefix, currObj, classes) {
    // expand every field in the object
    return (Object.keys(currObj).map((fieldName) => {
      // check for Object fields
      const fullName = prefix ? `${prefix}.${fieldName}` : fieldName
      if (currObj[fieldName] === Object(currObj[fieldName])) {
        return (
          // wrap every object in a labeled container
          <div className={classes.objContainer}>
            <span className={classes.borderLabel}>{fieldName}</span>
            {
              // recursively expand the fields of the object
              this.unroll(fullName, currObj[fieldName], classes)
            }
            <div className={classes.objectControlsContainer}>
              <Tooltip title={"Add to " + fullName}>
                <IconButton onClick={() => this.setState({
                  // defines a plus button which allows the user to add a field to the object
                  makingNewField: true, newFieldPrefix: fullName,
                })}
                >
                  <AddCircleTwoToneIcon fontSize="medium" /> 
                </IconButton>
              </Tooltip>
              <this.FormDeleteButton
                id={`${fullName}_del`}
                onConfirmClick={() => this.handleObjDeletion(fullName)}
                fullName={fullName}
              />
            </div>
          </div>
        );
      }
      // base case, field is not an Object; expand the field into a UI element
      return this.expandField(fullName, classes)
    }))
  }

  // given a fieldName of docInfo, turns docInfo[fieldName] into a UI element
  expandField(fieldName, classes) {
    let suffix = fieldName.split('.')
    suffix = suffix[suffix.length - 1]
    // don't need to display the base document ID, our dropdown already does that;
    // also avoid displaying deleted fields
    if ((suffix === '_id' && suffix === fieldName) || this.props.docInfo[fieldName] === undefined) {
      return (<span />);
    }
    // present dropdown with preset classification options for any classification field
    if (suffix.toLowerCase() === 'classification') {
      return (
        <this.FormSelect
          id={`docField_${fieldName}`}
          label={suffix}
          onChange={(event) => this.updateDoc(event, fieldName)}
          value={this.props.docInfo[fieldName]}
        >
          {this.classifications.map((className) => <MenuItem value={className} key={`class_${className}`}>{className}</MenuItem>)}
        </this.FormSelect>
      )
    }
    // restrict some fields to read-only (mainly ones handled by CouchDB)
    if (this.reservedFields.includes(fieldName)) {
      return (
        <this.FormField
          id={`docField_${fieldName}`}
          label={suffix}
          value={this.props.docInfo[fieldName]}
          InputProps={{
            readOnly: true,
            classes: {
              notchedOutline: classes.requiredField,
            },
          }}
        />
      )
    }
    // default case is to generate a textfield
    return (
      <span className={classes.textFieldContainer}>
        <this.FormField
          id={`docField_${fieldName}`}
          label={suffix}
          multiline
          value={this.props.docInfo[fieldName]}
          validation={() => this.checkDoc(fieldName)}
          onChange={(event) => this.updateDoc(event, fieldName)}
        />
        <span className={classes.deleteContainer}>
          <this.FormDeleteButton
            id={`${fieldName}_del`}
            onConfirmClick={() => this.handleObjDeletion(fieldName)}
            fullName={fieldName}
          />
        </span>
      </span>
    )
  }

  dbHelperText() {
    const { host, dbs } = this.props
    // user hasn't picked a host
    if(this.state.databasesLoading) {
      return '   Dbs Loading...'
    }
    if (!host) {
      return 'No host selected'
    }
    // host hasn't responded to ping
    if (!Object.prototype.hasOwnProperty.call(host, 'alive')) {
      return 'Host has not responded'
    }
    // host refused ping
    if (!host.alive) {
      return 'Host is offline'
    }
    // no dbs found at the host
    if (dbs.length === 0) {
      return 'No dbs found at this host'
    }
    return ''
  }

  docHelperText() {
    if(this.state.documentsLoading) {
      return '  Documents Loading...'
    }
    return ''
  }

  FormSelect = (props) => {
    const { classes } = this.props // fetch CSS styles
    const menuProps = {
      // defines the style of the popup list
      PaperProps: {
        style: {
          maxHeight: 300,
        },
      },
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    };
    const {
      id, label, helperText, ...otherProps
    } = props
    // some default TextField values
    const key = id

    // stores props we work with to build our component
    const wrappedProps = { id, key, label }
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <FormControl variant="outlined" className={classes.formField}>
        <InputLabel id={`${label}_input_label`}>{label}</InputLabel>
        <Select defaultValue='' variant="outlined" MenuProps={menuProps} {...wrappedProps} {...otherProps} />
        {helperText !== undefined && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
    /* eslint-enable react/jsx-props-no-spreading */
  }

  FormField = (props) => {
    const { classes } = this.props // fetch CSS styles
    const {
      id, label, readOnly, validation, ...otherProps
    } = props
    // some default TextField values
    const key = id
    const onChange = this.handleChange
    const placeholder = `Enter ${label}`

    // stores props we work with to build our component
    const wrappedProps = {
      id, key, label, placeholder, onChange,
    }

    // if this is a validated field, validation should be a function returning false on errors
    if (validation !== undefined) {
      wrappedProps.error = !validation()
      wrappedProps.helperText = validation('text')
    }
    // quick wrapper for read-only; if more InputProps functionality is needed, don't use
    // readOnly boolean and just favor defining readOnly in InputProps manually
    if (readOnly !== undefined) {
      wrappedProps.InputProps = { readOnly: true }
    }
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <TextField
        variant="outlined"
        className={classes.formField}
        {...wrappedProps}
        {...otherProps}
      />
    )
    /* eslint-enable react/jsx-props-no-spreading */
  }

  FormDeleteButton = (props) => {
    const {
      fullName, id, onConfirmClick, spanProps, ...otherProps
    } = props
    /* eslint-disable react/jsx-props-no-spreading */
    return (
      <span {...spanProps}>
        <ClickAwayListener onClickAway={this.resetDeletionStatus}>
          <Tooltip title={"Delete " + fullName}>
            <IconButton id={id} key={id} onClick={this.initiateDeletion} {...otherProps}>
              <DeleteIcon id={`${id}_pic`} key={`${id}_pic`} fontSize="small" />
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
        {this.state.deletionTarget === id
      && (
        <this.FormButton
          size="small"
          variant="outlined"
          onClick={onConfirmClick}
        >
        Confirm
        </this.FormButton>
      )}
      </span>
    );
    /* eslint-enable react/jsx-props-no-spreading */
  }

  // Button wrapper which defines some stylistic defaults
  // any explicit prop values will override these defaults
  FormButton = (props) => {
    const { classes } = this.props
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Button variant="contained" className={classes.formButton} {...props} />;
  }

  /* eslint-enable react/sort-comp */

  render() {
    const { classes } = this.props
    // give the user options to edit or create a doc; only shown before one has been selected
    if (this.props.editingDoc === null) {
      return (
        <div className={classes.centeredDiv}>
          <this.FormButton
            onClick={() => this.handleFormSwap(true)}
          >
            Edit A Document
          </this.FormButton>
          <this.FormButton
            onClick={() => this.handleFormSwap(false)}
          >
            Create A Document
          </this.FormButton>
        </div>
      );
    }

    return (
      <span>
        <Modal // popup window that appears when adding a new field
          open={this.state.makingNewField}
          onClose={this.handleModalClose}
        >
          <div className={classes.newFieldModal}>
            <div className={classes.centeredDiv}>
              <RadioGroup // radio buttons to select field type
                aria-label="fieldTypeSelect"
                name="fieldTypeSelect"
                value={this.state.newFieldType}
                onChange={(event) => this.setState({ newFieldType: event.target.value })}
                row
              >
                <FormControlLabel value="Text" control={<Radio />} label="Text" />
                <FormControlLabel value="Object" control={<Radio />} label="Object" />
              </RadioGroup>
              <div className={classes.lineBreak} />
              <this.FormField // name of the new field
                id="newFieldName"
                label="Name"
                placeholder={`Enter the name of the new ${this.state.newFieldType === 'Text' ? 'field' : 'object'}`}
                validation={this.checkValidFieldName}
                value={this.state.newFieldName}
                style={{ minWidth: 280 }}
              />
              <div className={classes.lineBreak} />
              <this.FormButton // button which triggers the actual creation of the new field
                size="small"
                onClick={this.handleAddition}
              >
                Create
              </this.FormButton>
            </div>
          </div>
        </Modal>
        <div className={classes.centeredDiv}>
          <this.FormSelect // dropdown for target host
            id="edit_hostNode"
            label='Host Node'
            onChange={this.handleHostInput}
            value={this.props.host.node_name ? this.props.host.node_name : ''}
            style={Object.prototype.hasOwnProperty.call(this.props.host, 'alive') && this.props.host.alive
              ? { color: '#000000' } : { color: '#f00000' }}
            helperText="Hosts shown in red are offline"
          >
            {this.props.nodes.map((node) => (
            // render host options harvested from md_nodes; display down hosts in red
              <MenuItem
                value={node.node_name}
                name={node.node_name}
                style={Object.prototype.hasOwnProperty.call(node, 'alive') && node.alive
                  ? { color: '#000000' } : { color: '#f00000' }}
              >
                {node.node_name}
              </MenuItem>
            ))}
          </this.FormSelect>
          <this.FormSelect
            id="edit_db"
            label='Database'
            onChange={this.handleDbInput}
            value={this.props.db}
            helperText={this.dbHelperText()}
          >
            {this.props.dbs.map((dbName) => <MenuItem value={dbName} key={`db_${dbName}`}>{dbName}</MenuItem>)}
          </this.FormSelect>
          {this.props.editingDoc
            && ( // if editing, display dropdown for target doc up top
              <this.FormSelect
                id="edit_doc_id"
                label='Document Id'
                onChange={this.populateDoc}
                value={this.props.doc_id}
                helperText={this.docHelperText()}
              >
                {this.props.doc_ids.map((docName) => <MenuItem value={docName} key={`doc_${docName}`}>{docName}</MenuItem>)}
              </this.FormSelect>
            )}
          <div className={classes.lineBreak} />
          { // display full hostname if we have a host selected
            this.props.host && (
              <this.FormField
                id="edit_fullHostname"
                label="Full Hostname"
                value={this.props.fullHostname}
                readOnly
              />
            )
          }
          <div className={classes.lineBreak} />
          <Divider variant="middle" className={classes.dividerBar} />
          <div className={classes.lineBreak} />
        </div>
        <div className={classes.mainGrid}>
          { // display document id entry field with other fields when creating a doc
            !(this.props.editingDoc) && (
              <span>
                <this.FormField
                  id='doc_id'
                  label='Document ID (optional)'
                  placeholder="Enter the id for the document"
                  validation={this.checkValidId}
                  value={this.props.doc_id}
                />
              </span>
            )
          }
          { // display the fields of the doc found at the specified host/db/doc
            this.expandedDoc(classes)
          }
          { (!this.props.editingDoc || this.props.doc_id !== '')
            && ( // provide a button for the user to add new fields to the doc
              <div className={classes.floatingAdd}>
                <Tooltip title={"Add fields to this doc"}>
                  <IconButton onClick={() => this.setState({
                    makingNewField: true, newFieldPrefix: '',
                  })}
                  >
                    < AddCircleTwoToneIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          <div className={classes.lineBreak} />
        </div>
        {this.props.editingDoc
          ? ( // if editing, show buttons to either submit changes or shift to doc creation
            <div className={classes.centeredDiv}>
              { // user should only be able to submit edits if they have a document selected
                this.props.doc_id !== '' && (
                  <this.FormButton
                    onClick={this.handleEditSubmit}
                  >
                    Push Changes
                  </this.FormButton>
                )
              }
              <this.FormButton
                onClick={() => this.handleFormSwap(false)}
              >
                Create A Document
              </this.FormButton>
            </div>
          )
          : ( // if creating, show buttons to either push the new doc or shift to doc editing
            <div className={classes.centeredDiv}>
              <this.FormButton
                onClick={this.handleSubmit}
              >
                Push New Document
              </this.FormButton>
              <this.FormButton
                onClick={() => this.handleFormSwap(true)}
              >
                Edit A Document
              </this.FormButton>
            </div>
          )}
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  editingDoc : getEditingDoc(state),
  docInfo : getDocInfo(state),
  nodes : getNodes(state),
  host : getHost(state),
  fullHostname : getFullHostname(state),
  doc_id : getId(state),
  doc_ids : getAllIds(state),
  db : getDb(state),
  dbs: getAllDbs(state),
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditDocPage));