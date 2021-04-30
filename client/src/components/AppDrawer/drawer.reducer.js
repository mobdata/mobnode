import { TOGGLE_DRAWER, OPEN_DRAWER, CLOSE_DRAWER } from 'components/AppDrawer'

// drawer is closed until the user opens it
const initialState = {
  open: false,
}

const createDrawerReducer = (drawerName = '') => (state = initialState, action) => {
  const { type } = action

  // do nothing if the action is meant for another drawerReducer
  if (action.drawerName !== drawerName) { return state }

  // any drawers extending AppDrawer's functionality should have open={this.props.open}
  switch (type) {
  case TOGGLE_DRAWER:
    return { open: !state.open }
  case OPEN_DRAWER:
    return { open: true }
  case CLOSE_DRAWER:
    return { open: false }
  default:
    return state
  }
}

export default createDrawerReducer
