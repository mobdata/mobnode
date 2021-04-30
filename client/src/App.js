import React, { Component } from 'react' // basic building blocks of a React app
import PropTypes from 'prop-types' // typechecking on App input props
import { connect } from 'react-redux' // links App props to the store's state
import { renderRoutes } from 'react-router-config' // display various route endpoints (i.e. tabs)
import ClassificationBanner from '@mobdata/classification-banner' // displays classification of the host
import AppBar from 'components/AppBar' // MobNode banner
import TabMenu from 'components/TabMenu' // app navigation tabs
import { // utility actions
  getActiveTab, getAppVersion, changeRoute, changeTab,
} from 'modules/App'
import { toggleDrawer } from 'components/AppDrawer' // action for opening/closing drawer
import Button from '@material-ui/core/Button' // for toggling the drawer
import BuildIcon from '@material-ui/icons/Build' // wrench icon
import logErrorOnServer from 'util/serverLog' // show client errors server-side
import ErrorPage from 'components/ErrorPage' // displayed if the app crashes

/* Component which defines what to display for our application given the current route.

   Note that this is not the top-most component in our tree -- index.js is what actually
   defines application-level wrappers and setup (such as the Redux store). This component
   can be thought of as "Page" -- it is essentially a wrapper which defines the display on
   any given page or tab of the app.
*/
class App extends Component {
  // input prop typecheck
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.shape({
      routes: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.version = getAppVersion()
    this.state = {
      error: false, // set to true if a critical error bubbles up
    }
  }

  // on mount, return to the last page the user was on
  componentDidMount() {
    const { pathname } = this.props.history.location
    const lastIndex = pathname.lastIndexOf('/')
    let parsedPathname = pathname
    if (lastIndex > 0 && lastIndex < (pathname.length - 1)) {
      parsedPathname = pathname.substring(lastIndex)
    }
    this.props.dispatch(changeTab(parsedPathname.replace('/', '')))
  }

  // catch-all for errors not caught by a lower-level component
  componentDidCatch(error, info) {
    logErrorOnServer(
      1,
      'Captured by App-level componentDidCatch()',
      error,
      info.componentStack,
    )
    // triggers error page to display
    this.setState({ error: true })
  }

  // called on tab changes
  changeRoute = (path) => this.props.dispatch(changeRoute(path))

  // changes drawer type to match current tab on tab swap
  onMenuClick = () => {
    const { activeTab } = this.props
    let drawerType

    switch (activeTab) {
    case 'nodes':
      drawerType = 'NodeDrawer'
      break
      // add cases for drawers on other tabs here
    default:
      drawerType = ''
      break
    }

    this.props.dispatch(toggleDrawer(drawerType))
  }

  render() {
    const { routes } = this.props.route
    if (this.state.error) {
      return <ErrorPage error={this.state.error} />
    }
    return (
      <div>
        <ClassificationBanner />
        <div style={{ paddingTop: '25px' }}>
          <AppBar // Mobnode banner
            version={this.version}
          />
          <TabMenu // menu of clickable tabs to navigate the app
            activeTab={this.props.activeTab}
            onChange={this.changeRoute}
          />
          {/* Add names of any tabs which use a Drawer to this array */}
          { ['nodes'].includes(this.props.activeTab) && (
            <Button // wrench button which pulls out a drawer with utilities depending on the tab
              raised="true"
              dense="true"
              color="secondary"
              onClick={this.onMenuClick}
              style={{
                zIndex: 1000,
              }}
            >
              <BuildIcon />
            </Button>
          )}
          {renderRoutes(routes)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  activeTab: getActiveTab(state),
})

export default connect(mapStateToProps)(App)
