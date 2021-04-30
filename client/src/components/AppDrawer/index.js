import AppDrawer from 'components/AppDrawer/AppDrawer'
// expose drawer functionalities
export default AppDrawer
export { default as createDrawerReducer } from 'components/AppDrawer/drawer.reducer'
export {
  TOGGLE_DRAWER,
  OPEN_DRAWER,
  CLOSE_DRAWER,
  toggleDrawer,
  openDrawer,
  closeDrawer,
} from 'components/AppDrawer/drawer.actions'
