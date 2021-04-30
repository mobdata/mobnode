import { createSelector } from 'reselect'
import {
  ADD_NODES, REFRESH_NODES, SELECT_NODES,
  FETCH_NODES_ATTEMPT, FETCH_NODES_SUCCESS, FETCH_NODES_FAILURE,
  DELETE_NODES_ATTEMPT, DELETE_NODES_SUCCESS,
} from 'modules/Nodes'

const initialState = {
  data: [],
  selected: [],
  loading: {
    fetch: false,
  },
}

const NodesReducer = (state = initialState, action) => {
  const { type } = action

  switch (type) {
  case ADD_NODES:
    return {
      ...state,
      data: [...action.nodes.map((node) => ({ ...node, edit_password: node.id })), ...state.data],
    }
  case REFRESH_NODES:
    return {
      ...state,
      data: state.data.map((node) => {
        const updatedNode = action.nodes.find(({id: updatedNodeId}) => node.id === updatedNodeId)
        return typeof updatedNode === 'undefined' ? node : updatedNode
      })
        .map((node) => ({ ...node, edit_password: node.id })),
    }
  case SELECT_NODES:
    return { ...state, selected: action.selectedNodes }
  case FETCH_NODES_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        fetch: true,
      },
    }
  case FETCH_NODES_SUCCESS:
    return {
      ...state,
      data: action.nodes.map((node) => ({ ...node, edit_password: node.id })),
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case FETCH_NODES_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case DELETE_NODES_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading
      },
    }
  case DELETE_NODES_SUCCESS:
    return {
      ...state,
      data: state.data.filter((node) => !action.deletedNodes.has(node.id)),
      selected: [],
    }
  default:
    return state
  }
}

export const getNodes = (state) => state.nodes.data
export const getFlattenedNodes = createSelector(
  getNodes,
  (nodes) => nodes.map((node) => ({ ...node, ...node.attributes })),
)
export const getParseFormattedNodes = createSelector(
  getNodes,
  (nodes) => nodes
    .reduce((acc, cur) => ({ ...acc, [cur.node_name]: cur }), {}),
)
export const getSelectedNodes = (state) => state.nodes.selected

export default NodesReducer
