import {
  ADD_CONDITIONS, REFRESH_CONDITIONS,
  FETCH_CONDITIONS_ATTEMPT, FETCH_CONDITIONS_SUCCESS, FETCH_CONDITIONS_FAILURE,
  DELETE_CONDITIONS_SUCCESS,
} from 'modules/Conditions'
import { TOGGLE_NODES_DISPLAY, MD_ATTRIBUTES_FAILURE, MD_ATTRIBUTES_SUCCESS } from './condition.actions';

const initialState = {
  data: [],
  selected: [],
  loading: {
    fetch: false,
  },
}

const ConditionsReducer = (state = initialState, action) => {
  const { type } = action

  switch (type) {
  case ADD_CONDITIONS:
    return { ...state, data: [...action.conditions, ...state.data] }
  case REFRESH_CONDITIONS:
    return {
      ...state,
      data: action.conditions,
      unchanged: action.unchanged,
    }
  case FETCH_CONDITIONS_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        fetch: true,
      },
    }
  case FETCH_CONDITIONS_SUCCESS:
    return {
      ...state,
      data: action.conditions,
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case FETCH_CONDITIONS_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case DELETE_CONDITIONS_SUCCESS:
    return {
      ...state,
      data: action.deletedConditions,
      unchanged: action.unchanged,
    }
  case TOGGLE_NODES_DISPLAY:
    return {
      ...state,
      viewnodes: !action.viewnodes,
    }
  case MD_ATTRIBUTES_FAILURE:
    return {
      ...state,
    }
  case MD_ATTRIBUTES_SUCCESS:
    return {
      ...state,
      mdAttributes: action.mdAttributes,
    }
  default:
    return state
  }
}

export const getConditions = (state) => state.conditions.data
export const getMdAttributes = (state) => state.conditions.mdAttributes
export const getSelectedConditions = (state) => state.conditions.selected

export default ConditionsReducer
