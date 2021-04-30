import AppDialog from 'components/AppDialog/AppDialog'
import CreatePasswordDialog from 'components/AppDialog/CreatePasswordDialog'
import EnterPasswordDialog from 'components/AppDialog/EnterPasswordDialog'
import ChangePasswordDialog from 'components/AppDialog/ChangePasswordDialog'

export default AppDialog
export { CreatePasswordDialog }
export { EnterPasswordDialog }
export { ChangePasswordDialog }
export { default as DialogReducer } from 'components/AppDialog/dialog.reducer'
export {
  OPEN_DIALOG,
  CLOSE_DIALOG,
  openDialog,
  closeDialog,
  OPEN_CREATE_PASSWORD_DIALOG,
  CLOSE_CREATE_PASSWORD_DIALOG,
  openCreatePasswordDialog,
  closeCreatePasswordDialog,
  OPEN_ENTER_PASSWORD_DIALOG,
  CLOSE_ENTER_PASSWORD_DIALOG,
  openEnterPasswordDialog,
  closeEnterPasswordDialog,
  OPEN_CHANGE_PASSWORD_DIALOG,
  CLOSE_CHANGE_PASSWORD_DIALOG,
  openChangePasswordDialog,
  closeChangePasswordDialog,
} from 'components/AppDialog/dialog.actions'
