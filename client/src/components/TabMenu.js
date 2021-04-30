import React, { Component } from 'react' // building blocks of React
import PropTypes from 'prop-types' // prop typechecking
import { withStyles } from '@material-ui/core/styles' // provides CSS styles to TabMenu
import Paper from '@material-ui/core/Paper' // adds a touch of shading to the menu
import { Tab, Tabs } from '@material-ui/core' // display for a tab and list of tabs respectively

const styles = () => ({
  // style for our Paper, ensures it covers the full background of the menu
  root: {
    flexGrow: 1,
    width: '100%',
  },
})

/* Defines the menu of tabs which displays across the top of the app for navigation.
   Doesn't actually define any links or the changing of the displayed page; that is defined by the
   onChange prop passed in from the owner which should perform this function. TabMenu can
   be thought of as a wrapper display class for a clickable, app-navigating menu. */
class TabMenu extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    classes: {
      root: '',
    },
  }

  // onChange should perform a route change to correspond with the new tab selection
  handleChange = (event, value) => {
    this.props.onChange(value)
  }

  render() {
    const { classes } = this.props

    return (
      <Paper className={classes.root} color="inherit">
        <Tabs
          value={this.props.activeTab} // display the correct tab as selected
          onChange={this.handleChange} // trigger route change on new tab selection
          indicatorColor="secondary" // color of the underlining bar for the current tab
          centered
          style={{
            backgroundColor: '#66023c', // menu color
            color: 'white', // font color for tabs
          }}
        >
          <Tab label="Nodes" value="nodes" />
          <Tab label="Rules" value="rules" />
          <Tab label="Conditions" value="conditions" />
          <Tab label="History" value="history" />
          <Tab label="Edit Doc" value="editdoc" />
          {/* Add extra tabs here */}
        </Tabs>
      </Paper>
    )
  }
}

export default withStyles(styles)(TabMenu)
