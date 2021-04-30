import {
  OPEN_DIALOG,
  CLOSE_DIALOG,
  OPEN_CREATE_PASSWORD_DIALOG,
  CLOSE_CREATE_PASSWORD_DIALOG,
  OPEN_ENTER_PASSWORD_DIALOG,
  CLOSE_ENTER_PASSWORD_DIALOG,
  OPEN_CHANGE_PASSWORD_DIALOG,
  CLOSE_CHANGE_PASSWORD_DIALOG,
} from 'components/AppDialog'
import {
  OPEN_MASS_UPDATE_DIALOG,
  CLOSE_MASS_UPDATE_DIALOG,
  OPEN_MASS_ADD_DIALOG,
  CLOSE_MASS_ADD_DIALOG,
} from './dialog.actions'

const initialState = {
  actions: [],
  message: '',
  open: false,
  openPasswordCreate: false,
  title: 'MobNode Alert',
  list: [],
}

const DialogReducer = (state = initialState, action) => {
  const { type } = action
  switch (type) {
  case OPEN_DIALOG:
    return {
      actions: action.actions,
      message: action.message,
      open: true,
      title: action.title,
      list: action.list,
    }
  case CLOSE_DIALOG:
    return { ...state, open: false }
  case OPEN_CREATE_PASSWORD_DIALOG:
    return {
      message: action.message,
      openPasswordCreate: true,
      title: action.title,
      onPasswordCreateSubmit: action.onPasswordCreateSubmit,
    }
  case CLOSE_CREATE_PASSWORD_DIALOG:
    return { ...state, openPasswordCreate: false }
  case OPEN_ENTER_PASSWORD_DIALOG:
    return {
      message: action.message,
      openPasswordEnter: true,
      title: action.title,
      onPasswordEnterSubmit: action.onPasswordEnterSubmit,
    }
  case CLOSE_ENTER_PASSWORD_DIALOG:
    return { ...state, openPasswordEnter: false }
  case OPEN_CHANGE_PASSWORD_DIALOG:
    return {
      message: action.message,
      openPasswordChange: true,
      title: action.title,
      onPasswordChangeSubmit: action.onPasswordChangeSubmit,
    }
  case CLOSE_CHANGE_PASSWORD_DIALOG:
    return { ...state, openPasswordChange: false }
  case OPEN_MASS_UPDATE_DIALOG:
    return { ...state, openMassUpdate: true, nodes: action.nodes }
  case CLOSE_MASS_UPDATE_DIALOG:
    return { ...state, openMassUpdate: false }
  case OPEN_MASS_ADD_DIALOG:
    return { ...state, openMassAdd: true }
  case CLOSE_MASS_ADD_DIALOG:
    return { ...state, openMassAdd: false }
  default:
    return state
  }
}

export default DialogReducer
