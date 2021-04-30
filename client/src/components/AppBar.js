import React from 'react' // used for JSX component render
import PropTypes from 'prop-types' // typechecking on unput props
import AppBar from '@material-ui/core/AppBar' // provides banner/menu bar
import Typography from '@material-ui/core/Typography' // text styling
import { withStyles } from '@material-ui/core/styles' // transform MainAppBar to HOC with classes prop

// only style req right now is for the bar to be full-width
const styles = () => ({
  root: {
    width: '100%',
  },
})

/* A banner across the top of the Mobnode app which displays the app title and version. */
const MainAppBar = (props) => (
  <div className={props.classes.root}>
    <AppBar position="static">
      <Typography type="title" color="inherit">
        MobNode v
        {props.version}
      </Typography>
    </AppBar>
  </div>
)

// input prop check
MainAppBar.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }),
  version: PropTypes.string,
}

// note these values are generally meaningless in practice, shouldn't have to use them
MainAppBar.defaultProps = {
  classes: {
    root: '',
  },
  version: '0.0 beta',
}

export default withStyles(styles)(MainAppBar)
