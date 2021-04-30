import { createStore, applyMiddleware, combineReducers } from 'redux' // basic redux tools
import thunk from 'redux-thunk' // eases mixing of async and synchronous dispatches
import { connectRouter, routerMiddleware } from 'connected-react-router' // needed for routing with redux

import reduxImmutableStateInvariant from 'redux-immutable-state-invariant' // used for bug checking in dev

// collect reducers (i.e. action results) for modules (i.e. significant app sections)
import { AppReducer as app } from 'modules/App'
import { NodesReducer as nodes } from 'modules/Nodes'
import { RuleReducer as rule } from 'modules/Rule'
import { ConditionsReducer as conditions } from 'modules/Conditions'
import { HistoryReducer as hist } from 'modules/History'
import { AttributesReducer as attributes } from 'modules/Attributes'
import { EditDocReducer as editdoc } from 'modules/EditDoc'

// collect reducers for components (i.e. significant components used in app)
import { DialogReducer as dialog } from 'components/AppDialog'
import { createTableReducer } from 'components/Table'
import { createDrawerReducer } from 'components/AppDrawer'

// still need to actually make the component reducers
const nodeTable = createTableReducer('NodeTable')
const nodeDrawer = createDrawerReducer('NodeDrawer')
const conditionTable = createTableReducer('ConditionTable')

const configureStore = (history, initialState = {}) => {
  // in dev, add a check which throws errors when reducers mutate state (which is illegal in redux)
  const middleware = process.env.NODE_ENV === 'development'
    ? [thunk, routerMiddleware(history), reduxImmutableStateInvariant()]
    : [thunk, routerMiddleware(history)]

  // redux needs a single reducer for the actual store
  return createStore(
    combineReducers({
      app,
      dialog,
      nodes,
      rule,
      conditions,
      hist,
      attributes,
      nodeTable,
      nodeDrawer,
      conditionTable,
      editdoc,
      router: connectRouter(history),
    }),
    initialState,
    applyMiddleware(...middleware),
  )
}

export default configureStore
