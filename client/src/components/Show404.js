import React from 'react' // component renders
import PropTypes from 'prop-types' // prop typechecking
import Typography from '@material-ui/core/Typography' // text styling
import { withStyles } from '@material-ui/core/styles' // div styling

// simple centered style
const styles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
  },
  flex: {
    flex: 1,
  },
})

/* Defines what to display in case of a 404 error. In our case, this occurs when the user
   attempts to navigate to a page/route in the app that does not exist. */
const Show404 = (props) => (
  <div className={props.classes.root}>
    <div className={props.classes.flex}>
      <Typography type="display1" align="center">404</Typography>
      <Typography type="headline" align="center">Not Found</Typography>
    </div>
  </div>
)

// withStyles creates a HOC with the classes prop containing our style names
Show404.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    flex: PropTypes.string,
  }),
}

Show404.defaultProps = {
  classes: {
    root: '',
    flex: '',
  },
}

export default withStyles(styles)(Show404)
