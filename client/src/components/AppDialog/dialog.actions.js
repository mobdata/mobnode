export const OPEN_DIALOG = 'OPEN_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'
export const OPEN_CREATE_PASSWORD_DIALOG = 'OPEN_CREATE_PASSWORD_DIALOG'
export const CLOSE_CREATE_PASSWORD_DIALOG = 'CLOSE_CREATE_PASSWORD_DIALOG'
export const OPEN_ENTER_PASSWORD_DIALOG = 'OPEN_ENTER_PASSWORD_DIALOG'
export const CLOSE_ENTER_PASSWORD_DIALOG = 'CLOSE_ENTER_PASSWORD_DIALOG'
export const OPEN_CHANGE_PASSWORD_DIALOG = 'OPEN_CHANGE_PASSWORD_DIALOG'
export const CLOSE_CHANGE_PASSWORD_DIALOG = 'CLOSE_CHANGE_PASSWORD_DIALOG'
export const OPEN_MASS_UPDATE_DIALOG = 'OPEN_MASS_UPDATE_DIALOG'
export const CLOSE_MASS_UPDATE_DIALOG = 'CLOSE_MASS_UPDATE_DIALOG'
export const OPEN_MASS_ADD_DIALOG = 'OPEN_MASS_ADD_DIALOG'
export const CLOSE_MASS_ADD_DIALOG = 'CLOSE_MASS_ADD_DIALOG'

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

export const openCreatePasswordDialog = (message, title, onPasswordCreateSubmit) => ({
  type: OPEN_CREATE_PASSWORD_DIALOG,
  message,
  title,
  onPasswordCreateSubmit,
})

export const closeCreatePasswordDialog = () => ({
  type: CLOSE_CREATE_PASSWORD_DIALOG,
})

export const openEnterPasswordDialog = (message, title, onPasswordEnterSubmit) => ({
  type: OPEN_ENTER_PASSWORD_DIALOG,
  message,
  title,
  onPasswordEnterSubmit,
})

export const closeEnterPasswordDialog = () => ({
  type: CLOSE_ENTER_PASSWORD_DIALOG,
})

export const openChangePasswordDialog = (message, title, onPasswordChangeSubmit) => ({
  type: OPEN_CHANGE_PASSWORD_DIALOG,
  message,
  title,
  onPasswordChangeSubmit,
})

export const closeChangePasswordDialog = () => ({
  type: CLOSE_CHANGE_PASSWORD_DIALOG,
})

export const openMassUpdateDialog = (nodes) => ({
  type: OPEN_MASS_UPDATE_DIALOG,
  nodes,
})

export const closeMassUpdateDialog = () => ({
  type: CLOSE_MASS_UPDATE_DIALOG,
})

export const openMassAddDialog = () => ({
  type: OPEN_MASS_ADD_DIALOG,
})

export const closeMassAddDialog = () => ({
  type: CLOSE_MASS_ADD_DIALOG,
})
