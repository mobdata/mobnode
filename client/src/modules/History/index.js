import HistoryPage from 'modules/History/HistoryPage'

export default HistoryPage
export {
  FETCH_REVISIONS_ATTEMPT,
  FETCH_REVISIONS_SUCCESS,
  FETCH_REVISIONS_FAILURE,
  UPDATE_SELECTED_REVISION,
  fetchRevisions,
  fetchRevisionsAttempt,
  fetchRevisionsSuccess,
  fetchRevisionsFailure,
  updateSelectedRevision,
} from 'modules/History/history.actions'
export {
  default as HistoryReducer,
  getRevisions,
  getSelectedRevision,
} from 'modules/History/history.reducer'
