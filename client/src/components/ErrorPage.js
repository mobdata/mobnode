import React from 'react' // component renders
import Paper from '@material-ui/core/Paper' // background styling
import Typography from '@material-ui/core/Typography' // text styling

// provide some spacing around the error message
const styles = {
  paper: {
    padding: 15,
    margin: 25,
  },
}

/* Defines the display for the equivalent of a blue-screen for our app. It's only displayed
   if an error is caught at the base App-level, which should never occur with proper handling
   in our components unless something is seriously wrong. */
const ErrorPage = () => (
  <Paper style={styles.paper} elevation={4}>
    <Typography type="headline" component="h3">
      An Internal Error Occurred
      {' '}
      <span role="img" aria-label="emoji sick face">🤒</span>
    </Typography>
    <Typography component="p">
      The application experienced a serious error which will prevent
      it from working. Please inform your system administrator or the
      maintainer of the application.
    </Typography>
    <br />
    <Typography component="p">
      <a href="http://mobdata.github.io/">MobData Help Site</a>
    </Typography>
  </Paper>
)

export default ErrorPage
