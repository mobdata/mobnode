// the only actions for a basic drawer are opening/closing
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const OPEN_DRAWER = 'OPEN_DRAWER'
export const CLOSE_DRAWER = 'CLOSE_DRAWER'

// Synchronous actions
export const toggleDrawer = (drawerName) => ({
  type: TOGGLE_DRAWER,
  drawerName,
})

export const openDrawer = (drawerName) => ({
  type: OPEN_DRAWER,
  drawerName,
})

export const closeDrawer = (drawerName) => ({
  type: CLOSE_DRAWER,
  drawerName,
})
