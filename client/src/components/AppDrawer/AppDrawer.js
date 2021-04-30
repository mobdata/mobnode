import React from 'react' // component rendering
import PropTypes from 'prop-types' // prop typechecking
import Drawer from '@material-ui/core/Drawer' // base slideout drawer
import { withStyles } from '@material-ui/core/styles' // allows us to define CSS-like styles

const styles = {
  // style for the the display contained by the drawer
  root: {
    paddingTop: 25,
  },
}

/* Defines the base display for a drawer in our app. Intended to be extended by
   other components which should define what they want to display in the drawer
   in their own render functions. */
const AppDrawer = (props) => (
  <Drawer
    anchor={props.anchor}
    open={props.open}
    variant="temporary" // drawer will shadow over app
    onBackdropClick={props.onBackdropClick}
  >
    <div className={props.classes.root} />
    {props.children}
  </Drawer>
)

// verify correct props were provided
AppDrawer.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }),
  anchor: PropTypes.string,
  open: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  onBackdropClick: PropTypes.func,
}

// should never fall back to default props as the drawer will not function properly
AppDrawer.defaultProps = {
  classes: {
    root: '',
  },
  anchor: 'left',
  children: [],
  onBackdropClick: null,
}

export default withStyles(styles)(AppDrawer)
