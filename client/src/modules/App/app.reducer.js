import { CHANGE_TAB } from 'modules/App'

const initialState = {
  activeTab: 'rules',
}

const AppReducer = (state = initialState, action) => {
  const { type } = action

  switch (type) {
  case CHANGE_TAB:
    return { ...state, activeTab: action.activeTab || 'rules' }
  default:
    return state
  }
}

export const getActiveTab = (state) => state.app.activeTab

export const getAppVersion = () => process.env.REACT_APP_TAG

export default AppReducer
