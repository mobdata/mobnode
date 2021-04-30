import { openDialog, closeDialog } from 'components/AppDialog'
import callApi, { apiCallReturn } from 'util/apiCaller'
import { changeAddedRows } from '../../components/Table/table.actions'

export const ADD_NODES = 'ADD_NODES'
export const REFRESH_NODES = 'REFRESH_NODES'
export const SELECT_NODES = 'SELECT_NODES'

export const FETCH_NODES_ATTEMPT = 'FETCH_NODES_ATTEMPT'
export const FETCH_NODES_SUCCESS = 'FETCH_NODES_SUCCESS'
export const FETCH_NODES_FAILURE = 'FETCH_NODES_FAILURE'

export const DELETE_NODES_ATTEMPT = 'DELETE_NODES_ATTEMPT'
export const DELETE_NODES_SUCCESS = 'DELETE_NODES_SUCCESS'
export const DELETE_NODES_FAILURE = 'DELETE_NODES_FAILURE'

// Synchronous functions
export const addNodes = (nodes) => ({
  type: ADD_NODES,
  nodes,
})

export const refreshNodes = (nodes) => ({
  type: REFRESH_NODES,
  nodes,
})

export const selectNodes = (selectedNodes) => ({
  type: SELECT_NODES,
  selectedNodes,
})

export const fetchNodesAttempt = () => ({
  type: FETCH_NODES_ATTEMPT,
})

export const fetchNodesSuccess = (nodes) => ({
  type: FETCH_NODES_SUCCESS,
  nodes,
})

export const fetchNodesFailure = () => ({
  type: FETCH_NODES_FAILURE,
})

export const deleteNodesAttempt = () => ({
  type: DELETE_NODES_ATTEMPT,
})

export const deleteNodesSuccess = (deletedNodes) => ({
  type: DELETE_NODES_SUCCESS,
  deletedNodes,
})

export const deleteNodesFailure = () => ({
  type: DELETE_NODES_FAILURE,
})

// Asynchronous functions
export const fetchNodes = () => async (dispatch) => {

  dispatch(fetchNodesAttempt());
  const res = await callApi('nodes')
  if (res.status !== 200) {
    dispatch(fetchNodesFailure())
  } else {
    const body = await res.json()
    // const nodesNoHome = body.rows.nodes.filter((node) => node.node_name !== 'home_node')
    dispatch(fetchNodesSuccess(body.rows))
  }
}

export const attemptPasswordChange = (nodeId, password, newPassword) => async (dispatch) => {
  try {
    const response = await apiCallReturn(`nodes/${nodeId}-${password}-${newPassword}`, 'post')
    const success = await response.result === 'SUCCESS'
    if (success) {
      dispatch(openDialog(
        'Success!',
        'Password changed successfully.',
        [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
        [],
      ))
    }
    return success;
  } catch (err) {
    return false
  }
}

export const createNodes = (nodes) => async (dispatch) => {
  // TODO: This should be able to format the data so that
  // if bulk nodes are being created, it will hit the future bulk
  // endpoint, otherwise it will send just one node to create

  let response
  const body = []

  // Converts any single nodes to an array for the loop and calls the Api for each
  await Promise.all(nodes.map(async (data) => {
    try {
      response = await callApi('nodes', 'post', data)
    } catch (err) {
      return dispatch(openDialog(
        'Error Creating Node(s)',
        'Unable to connect to the server.',
        [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
        [],
      ))
    }

    const res = await response.json()
    body.push(res)
    const { status } = response

    if (status !== 201) {
      const { errors } = res
      return dispatch(openDialog(
        'Error Creating Node(s)',
        'The server responded with the following errors: ',
        [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
        Object.values(errors).map(({ msg }) => msg),
      ))
    }
    return body
  }))
  dispatch(openDialog(
    'Success!',
    'Node(s) created successfully.',
    [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
    body.map((node) => node.node_name),
  ))
  return dispatch(addNodes(body));
}

/*
This update method overrides the existing copy of the node in CouchDB. It is not
used because it deletes the password in the database. (As the node's local copy does
not have the password)
*/
export const updateNodesFull = (nodes) => async (dispatch) => {
  const response = await callApi('nodes', 'put', { nodes })
  const body = await response.json()
  const { rows: updatedNodes } = body

  if (response.status !== 200) {
    return dispatch(openDialog(
      'Error Updating Nodes',
      'Failed to update nodes.',
      [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
      [],
    ))
  }
  const close = () => {
    dispatch(closeDialog())
    dispatch(refreshNodes(updatedNodes))
  }

  return dispatch(openDialog(
    'Success!',
    'Nodes updated successfully.',
    [{ label: 'Close', action: () => close(), focused: true }],
    [],
  ))
  // dispatch(refreshNodes(updatedNodes))
}

export const updateNodes = (nodes) => async (dispatch) => {
  let nodesUpdated = [];
  let hostsUpdated = [];
  let nodesFailed = [];

  return Promise.all(nodes.map((node) =>
    Promise.resolve(callApi(`nodes/update/${node.id}`, 'POST', { node }))
      .then(response => {
        if (response.status === 200) {
          nodesUpdated.push(node);
          hostsUpdated.push(node.node_name); // populated for the success dialog below
        }
        else {
          dispatch(openDialog(
                        `Error Updating Node ${node.node_name}`,
                        'Unable to connect to the server.',
                        [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
                        [node.node_name],
          ));
          nodesFailed.push(node.node_name);
        }
      }
      )
  )).then((nodes) => {
    if (nodesUpdated.length > 0) {
      dispatch(openDialog('Done!',
        'The following nodes were updated successfully.',
        [{label: 'Close', action: () => dispatch(closeDialog()), focused: true}],
        hostsUpdated
      ))
      dispatch(refreshNodes(nodesUpdated))
    }
  })
}

export const deleteNodes = (nodes) => async (dispatch) => {
  dispatch(deleteNodesAttempt());

  const res = await callApi('nodes', 'delete', { nodes })
  let couchStatus = false
  res.json().then(((body) => {
    if (body.rows !== undefined) {
      couchStatus = body.rows[0].ok
    }
  }))

  if (res.status !== 200 && couchStatus !== true) {
    dispatch(openDialog(
      'Error Deleting Nodes',
      'Failed to delete node.',
      [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
      [],
    ))
    dispatch(deleteNodesFailure())
  } else {
    // Remove the nodes from the clients store
    dispatch(openDialog(
      'Success!',
      'Nodes deleted successfully.',
      [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
      [],
    ))
    dispatch(deleteNodesSuccess(new Set(nodes.map(({ id: nodeId }) => nodeId))))
  }
}

// * Methods for handling file-uploaded nodes

// similar to "normalizeNodes" but for one node, clears fields that couchDB creates.
export const formatNodeUpload = (node) => {
  const commonAttributes = ['id', 'rev', '_id', '_rev', 'node_name', 'protocol', 'host',
    'port', 'username', 'password', 'attributes', 'created_on', 'updated_on', 'url']

  const entries = Object.entries(node)
  const customAttributes = entries
    .filter((entry) => !commonAttributes.includes(entry[0]))
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
  const attributes = entries
    .filter((entry) => commonAttributes.includes(entry[0]) && !['id', 'rev', '_id', '_rev', 'created_on', 'updated_on'].includes(entry[0]))
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
  const protocol = node.protocol ? node.protocol : 'https'
  const port = node.port ? node.port : '6984'
  const urlString = `${protocol}://${node.host}:${port}`
  return {
    ...attributes,
    port,
    protocol,
    url: urlString,
    attributes: { ...node.attributes, ...customAttributes },
  }
}

export const checkIfNode = (node) => {
  const nodeTypes = {
    node_name: 'string',
    host: 'string',
    attributes: 'object',
    password: 'string',
    username: 'string',
  }

  let matches = 0
  Object.keys(nodeTypes).forEach((key) => {
    const nodeKey = typeof node[key]
    if (nodeKey === nodeTypes[key]) {
      matches += 1
    }
  })
  let doctype = 'notNode'

  if (matches >= Object.keys(nodeTypes).length) {
    doctype = 'completeNode'
    return doctype
  }

  if (matches > 0) {
    doctype = 'incompleteNode'
    if (typeof node.attributes === 'undefined') return checkIfNode(formatNodeUpload(node))
  }

  return doctype
}

export const lookForNodes = (doc, complete, incomplete) => {
  if (Array.isArray(doc)) {
    doc.forEach((entry) => {
      lookForNodes(entry, complete, incomplete)
    })
  } else if (typeof doc === 'object' && doc !== null) {
    const doctype = checkIfNode(doc)
    if (doctype === 'completeNode') complete.push(formatNodeUpload(doc))
    if (doctype === 'incompleteNode') incomplete.push(formatNodeUpload(doc))
    if (doctype === 'notNode') {
      Object.keys(doc).forEach((key) => {
        lookForNodes(doc[key], complete, incomplete)
      })
    }
  }
}

export const csvToObjectArray = (csv) => {
  const lines = csv.split('\n');
  const result = [];

  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i += 1) {
    const obj = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j += 1) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }
  return result
}

export const handleDuplicates = (replacements, dispatch) => new Promise((resolve, reject) => {

  const closeAction = () => {
    dispatch(closeDialog())
    reject(replacements)
  }
  const acceptAction = () => {
    dispatch(updateNodes(replacements)).then(dispatch(closeDialog()))
    resolve(replacements)
  }
  dispatch(openDialog(
    'Duplicate Nodes Found',
    'We found nodes with the same name as ones currently in the table. Would you like to update them with the new versions?',
    [
      { label: 'No, Discard', action: closeAction, focused: false },
      { label: 'Yes, update these nodes', action: acceptAction, focused: true },
    ],
    replacements.map((node) => node.node_name),
  ))
})

export const handleIncomplete = (incomplete, dispatch) => new Promise((resolve, reject) => {
  const closeAction = () => {
    dispatch(closeDialog())
    reject(incomplete)
  }

  const acceptAction = () => {
    dispatch(changeAddedRows('NodeTable', incomplete.map((node) => ({ ...node, ...node.attributes }))))
    dispatch(closeDialog())
    resolve(incomplete)
  }

  dispatch(openDialog(
    'Incomplete Nodes Found',
    'We found some objects that look like nodes, but were missing some fields. Would you like to fill them in? You can cancel any rows you don\'t want to add.',
    [
      { label: 'No, Discard', action: closeAction, focused: false },
      { label: 'Yes, add these nodes', action: acceptAction, focused: true },
    ],
    [],
  ))
})

export const handleNodesFile = (file, nodes) => async (dispatch) => {
  let doc
  try {
    doc = JSON.parse(file)
  } catch (error) {
    doc = csvToObjectArray(file)
  }
  const complete = []
  const incomplete = []
  lookForNodes(doc, complete, incomplete)
  // split the complete/incomplete arrays based on whether that node already exists
  const existingNodes = nodes.map((node) => node.node_name)
  const completeNew = complete.filter((node) => !existingNodes.includes(node.node_name))
  const completeDup = complete.filter((node) => existingNodes.includes(node.node_name))
  const incompleteNew = incomplete.filter((node) => !existingNodes.includes(node.node_name))
  const incompleteDup = incomplete.filter((node) => existingNodes.includes(node.node_name))
  const replacements = [...completeDup, ...incompleteDup].map((node) => {
    const old = nodes.find((n) => n.node_name === node.node_name)
    return { ...old, ...node, attributes: { ...old.attributes, ...node.attributes } }
  })

  // Handling complete duplicates: for now just make a batch decision to update or discard
  if (typeof replacements[0] !== 'undefined') {
    handleDuplicates(replacements, dispatch).catch()
  }

  // Handling incomplete duplicates: update fields or discard. For now bundled with complete

  // Handling new incompletes: create dialog for filling in gaps? Goal is to create added rows
  if (typeof incompleteNew[0] !== 'undefined') {
    handleIncomplete(incompleteNew, dispatch).catch()
  }

  // Handling new and complete nodes, simple: just add them
  completeNew.forEach((node) => dispatch(createNodes(formatNodeUpload(node))))

  if (complete[0] === undefined && incomplete[0] === undefined) {
    dispatch(openDialog(
      'No Nodes Found',
      'The file you uploaded either could not be parsed or did not contain any nodes.',
      [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
      [],
    ))
  }
}
