import {
  FETCH_REVISIONS_ATTEMPT,
  FETCH_REVISIONS_SUCCESS,
  FETCH_REVISIONS_FAILURE,
  UPDATE_SELECTED_REVISION,
} from 'modules/History'

const initialState = {
  revisions: [],
  selectedRevision: 0,
  loading: {
    revisions: false,
  },
}

const HistoryReducer = (state = initialState, action) => {
  const { type } = action

  switch (type) {
  case FETCH_REVISIONS_ATTEMPT:
    return { ...state, loading: { revisions: true } }
  case FETCH_REVISIONS_SUCCESS:
    return {
      ...state,
      revisions: action.revisions,
      loading: {
        revisions: false,
      },
    }
  case FETCH_REVISIONS_FAILURE:
    return { ...state, loading: { revisions: false } }
  case UPDATE_SELECTED_REVISION:
    return { ...state, selectedRevision: action.selectedRevision }
  default:
    return state
  }
}

export const getRevisions = (state) => state.hist.revisions
export const getSelectedRevision = (state) => state.hist.selectedRevision

export default HistoryReducer
