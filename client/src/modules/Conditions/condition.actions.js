import callApi from 'util/apiCaller'
import { openDialog, closeDialog } from 'components/AppDialog'

export const ADD_CONDITIONS = 'ADD_CONDITIONS'
export const REFRESH_CONDITIONS = 'REFRESH_CONDITIONS'
export const SELECT_CONDITIONS = 'SELECT_CONDITIONS'

export const FETCH_CONDITIONS_ATTEMPT = 'FETCH_CONDITIONS_ATTEMPT'
export const FETCH_CONDITIONS_SUCCESS = 'FETCH_CONDITIONS_SUCCESS'
export const FETCH_CONDITIONS_FAILURE = 'FETCH_CONDITIONS_FAILURE'

export const DELETE_CONDITIONS_ATTEMPT = 'DELETE_CONDITIONS_ATTEMPT'
export const DELETE_CONDITIONS_SUCCESS = 'DELETE_CONDITIONS_SUCCESS'
export const DELETE_CONDITIONS_FAILURE = 'DELETE_CONDITIONS_FAILURE'

export const TOGGLE_NODES_DISPLAY = 'TOGGLE_NODES_DISPLAY'
export const MD_ATTRIBUTES_SUCCESS = 'MD_ATTRIBUTES_SUCCESS'
export const MD_ATTRIBUTES_FAILURE = 'MD_ATTRIBUTES_FAILURE'

// Synchronous functions
export const addConditions = (conditions) => ({
  type: ADD_CONDITIONS,
  conditions,
})

export const refreshConditions = (conditions, unchanged) => ({
  type: REFRESH_CONDITIONS,
  conditions,
  unchanged,
})

export const selectConditions = (selectedConditions) => ({
  type: SELECT_CONDITIONS,
  selectedConditions,
})

export const fetchConditionsAttempt = () => ({
  type: FETCH_CONDITIONS_ATTEMPT,
})

export const fetchConditionsSuccess = (conditions) => ({
  type: FETCH_CONDITIONS_SUCCESS,
  conditions,
})

export const fetchConditionsFailure = () => ({
  type: FETCH_CONDITIONS_FAILURE,
})

export const deleteConditionsAttempt = () => ({
  type: DELETE_CONDITIONS_ATTEMPT,
})

export const deleteConditionsSuccess = (deletedConditions, unchanged) => ({
  type: DELETE_CONDITIONS_SUCCESS,
  deletedConditions,
  unchanged,
})

export const deleteConditionsFailure = () => ({
  type: DELETE_CONDITIONS_FAILURE,
})

export const toggleNodes = (viewnodes) => ({
  type: TOGGLE_NODES_DISPLAY,
  viewnodes,
})

export const fetchMdAttributesSuccess = (mdAttributes) => ({
  type: MD_ATTRIBUTES_SUCCESS,
  mdAttributes,
})

export const fetchMdAttributesFailure = () => ({
  type: MD_ATTRIBUTES_FAILURE,
})

// Asynchronous functions
export const fetchConditions = () => async (dispatch) => {
  dispatch(fetchConditionsAttempt());
  const res = await callApi('conditions')
  const body = await res.json()

  if (res.status !== 200 && res.status !== 201) {
    return dispatch(fetchConditionsFailure())
  }

  return dispatch(fetchConditionsSuccess(body.rows))
}

//export const fetchRevisions = () => async (dispatch) => {
//  dispatch(fetchRevisionsAttempt())
//  const res = await callApi('rules/script')
//  const { revisions } = await res.json()
//
//  if (res.status !== 200) {
//    return dispatch(fetchRevisionsFailure())
//  }
//
//  return dispatch(fetchRevisionsSuccess(revisions))
//}

export const fetchMdAttributes = () => async (dispatch) => {
  const res = await callApi('nodes')

  if (res.status !== 200 && res.status !== 201) {
    return dispatch(fetchMdAttributesFailure())
  }
  const body = await res.json()
  const nodes = body.rows
  let mdAttributes = ['No attributes found.']
  if (typeof nodes[0].attributes !== 'undefined') {
    mdAttributes = nodes
      .map((node) => Object.keys(node.attributes))
      .reduce((acc, cur) => {
        cur.forEach((att) => {
          if (!acc.includes(att)) { acc.push(att) }
        })
        return acc
      })
    console.log("mdAttributes: " + mdAttributes);
    mdAttributes = mdAttributes.map((att) => {
      // eslint-disable-next-line camelcase
      const node_values = nodes.map((node) => ({
        node_name: node.node_name,
        value: node.attributes[`${att}`],
      })).filter((node) => node.value !== undefined)
      return {
        attribute: att,
        open: false,
        node_values,
      }
    })
    console.log("mdAttributes2: " + mdAttributes);
  }
  return dispatch(fetchMdAttributesSuccess(mdAttributes))
}

export const reloadConditions = () => async (dispatch) => {

  const res = await callApi('conditions')

  if (res.status !== 200 && res.status !== 201) {
    return dispatch(fetchConditionsFailure())
  }
  const body = await res.json()
  return dispatch(refreshConditions(body.rows, true))
}
//is this called from anywhere?
export const createConditions = (conditions) => async (dispatch) => {
  // TODO: This should be able to format the data so that
  // if bulk conditions are being created, it will hit the future bulk
  // endpoint, otherwise it will send just one condition to create
  const data = Array.isArray(conditions) ? conditions[0] : conditions
  return dispatch(addConditions([data]))
}

export const updateConditions = (conditions) => async (dispatch) => {
  const updatedConditions = conditions.map((condition) => ({
    condition_text: condition.condition_text,
    on_status: condition.on_status,
  }))
  const doc = await callApi('md_config')
  const current = await doc.json()
  if (doc.status !== 200) {
    return dispatch(openDialog(
      'Error Updating Conditions',
      'There was a problem updating the conditions. Details: md_config call failed.',
      [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
      [],
    ))
  }
  const conddoc = current.rows[0]
  const newdoc = {
    _id: conddoc.id,
    _rev: conddoc.rev,
    ...conddoc,
    conditions: updatedConditions,
  }
  const res = await callApi('conditions', 'put', newdoc)
  // handling possible error differently here since we don't need anything from the response
  const message = (res.status !== 200) ? ['Error Updating Conditions', 'There was a problem updating the conditions.  Details: Put conditions failed.'] : ['Success!', 'Changes made successfully.']
  dispatch(openDialog(
    message[0],
    message[1],
    [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
    [],
  ))
  return dispatch(reloadConditions())
}

// deleteConditions sets the conditions state value without the removed conditions. Doesn't not update the conditions in Couch.
export const deleteConditions = (conditions) => async (dispatch) => {
  dispatch(deleteConditionsSuccess(conditions, false))
}
