// * import all the constants from actions
import { FETCH_ATTRIBUTES_ATTEMPT, FETCH_ATTRIBUTES_FAILURE, FETCH_ATTRIBUTES_SUCCESS, TOGGLE_ATTRIBUTE_OPEN } from 'modules/Attributes'

const initialState = {
  data: [],
}

const AttributesReducer = (state = initialState, action) => {
  const { type } = action
  switch (type) {
  case FETCH_ATTRIBUTES_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        fetch: true,
      },
    }
  case FETCH_ATTRIBUTES_FAILURE:
    return {
      ...state,
      data: [{
        attribute: 'No attributes found',
        open: false,
        node_values: [
          { node_name: '' },
          { value: '' },
        ],
      }],
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case FETCH_ATTRIBUTES_SUCCESS:
    return {
      ...state,
      data: action.mdAttributes,
      loading: {
        ...state.loading,
        fetch: false,
      },
    }
  case TOGGLE_ATTRIBUTE_OPEN:
    return {
      ...state,
      data: state.data.map((att) => (att.attribute !== action.attribute ? att
        : {
          ...att,
          open: !att.open,
        })),
    }
  default:
    return state
  }
}

export const getAttributes = (state) => state.attributes.data

export default AttributesReducer
