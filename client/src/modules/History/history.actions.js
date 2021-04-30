import callApi from 'util/apiCaller'

export const FETCH_REVISIONS_ATTEMPT = 'FETCH_REVISIONS_ATTEMPT'
export const FETCH_REVISIONS_SUCCESS = 'FETCH_REVISIONS_SUCCESS'
export const FETCH_REVISIONS_FAILURE = 'FETCH_REVISIONS_FAILURE'

export const UPDATE_SELECTED_REVISION = 'UPDATE_SELECTED_REVISION'

export const fetchRevisionsAttempt = () => ({
  type: FETCH_REVISIONS_ATTEMPT,
})

export const fetchRevisionsSuccess = (revisions) => ({
  type: FETCH_REVISIONS_SUCCESS,
  revisions,
})

export const fetchRevisionsFailure = () => ({
  type: FETCH_REVISIONS_FAILURE,
})

export const updateSelectedRevision = (selectedRevision) => ({
  type: UPDATE_SELECTED_REVISION,
  selectedRevision,
})
export const fetchRevisions = () => async (dispatch) => {
  dispatch(fetchRevisionsAttempt())
  const res = await callApi('rules/script')
  const { revisions } = await res.json()

  if (res.status !== 200) {
    return dispatch(fetchRevisionsFailure())
  }

  return dispatch(fetchRevisionsSuccess(revisions))
}
