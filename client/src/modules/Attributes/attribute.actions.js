import callApi from 'util/apiCaller'

export const TOGGLE_ATTRIBUTE_OPEN = 'TOGGLE_ATTRIBUTE_OPEN'
export const FETCH_ATTRIBUTES_ATTEMPT = 'FETCH_ATTRIBUTES_ATTEMPT'
export const FETCH_ATTRIBUTES_SUCCESS = 'FETCH_ATTRIBUTES_SUCCESS'
export const FETCH_ATTRIBUTES_FAILURE = 'FETCH_ATTRIBUTES_FAILURE'

export const fetchAttributesAttempt = () => ({
  type: FETCH_ATTRIBUTES_ATTEMPT,
})

// * Reducer Method for successful attributes retrieval
export const fetchAttributesSuccess = (mdAttributes) => ({
  type: FETCH_ATTRIBUTES_SUCCESS,
  mdAttributes,
})

// * Reducer Method for failed attributes retrieval
export const fetchAttributesFailure = () => ({
  type: FETCH_ATTRIBUTES_FAILURE,
})

// tells the reducer which list item to expand
export const toggleAttributeOpen = (attribute) => ({
  type: TOGGLE_ATTRIBUTE_OPEN,
  attribute,
})

// * Method for retrieving nodes and reshaping
// possibly split it into a separate get/reshape
export const fetchMdAttributes = () => async (dispatch) => {
  dispatch(fetchAttributesAttempt())
  const res = await callApi('nodes')

  if (res.status !== 200 && res.status !== 201) {
    return dispatch(fetchAttributesFailure())
  }
  const body = await res.json()
  const nodes = body.rows
  let mdAttributes = ['No attributes found.']
  // console.log(nodes[0].attributes)
  if (typeof nodes[0].attributes !== 'undefined') {
    mdAttributes = nodes
      .map((node) => Object.keys(node.attributes))
      .reduce((acc, cur) => {
        cur.forEach((att) => {
          if (!acc.includes(att)) { acc.push(att) }
        })
        return acc
      })
    mdAttributes = mdAttributes.map((att) => {
      const vals = nodes.reduce((acc, cur) => {
        if (!acc.includes(cur.attributes[`${att}`])) {
          return [...acc, cur.attributes[`${att}`]]
        }
        return acc
      }, [])
      // eslint-disable-next-line camelcase
      const node_values = vals.map((val) => {
        const arr = []
        nodes.forEach((node) => {
          if (node.attributes[`${att}`] === val) arr.push(node.node_name)
        })
        return {
          value: val,
          nodelist: arr.join(', '),
        }
      })
      /* const node_values = nodes.map(node => ({
        node_name: node.node_name,
        value: node.attributes[`${att}`],
      })).filter(node => node.value !== undefined) */
      return {
        attribute: att,
        open: false,
        node_values,
      }
    })
  }
  return dispatch(fetchAttributesSuccess(mdAttributes))
}
