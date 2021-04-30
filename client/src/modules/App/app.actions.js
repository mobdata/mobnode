import { push } from 'connected-react-router'

export const CHANGE_TAB = 'CHANGE_TAB'
export const OPEN_DIALOG = 'OPEN_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'

export const changeTab = (activeTab) => ({
  type: CHANGE_TAB,
  activeTab,
})

export const changeRoute = (path, changeActiveTab = true) => (dispatch) => {
  if (changeActiveTab) {
    dispatch(changeTab(path))
  }
  dispatch(push(path))
}


export const openDialog = (title, message, actions, list) => ({
  type: OPEN_DIALOG,
  actions,
  message,
  title,
  list,
  open: true,
})

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
  open: false,
})
