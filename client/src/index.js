// building blocks of a react app
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider, ReactReduxContext } from 'react-redux'; // basic redux tools
import createHistory from 'history/createBrowserHistory' // allows access to browser/session history
import { ConnectedRouter } from 'connected-react-router' // allows routing with redux store
import { renderRoutes } from 'react-router-config' // provides rendering-by-tab, i.e. routing
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles' // app styling
import blueGrey from '@material-ui/core/colors/blueGrey' // for MUI theme
import amber from '@material-ui/core/colors/amber' // for MUI theme

import './index.css' // a few general stylings for html elements
import configureStore from './createStore' // initializes redux store
import routes from './routes' // defines which components render based on our current route/URL
import registerServiceWorker from './registerServiceWorker' // reduces app load times in production

// redux initialization
const history = createHistory()
const store = configureStore(history)

// define general theme for app
const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: amber,
    text: {
      lightDivider: 'rgba(255, 255, 255, 0.075)',
    },
  },
  typography: {
    useNextVariants: true,
  },
})

/*
  Rendering of the app is wrapped as follows:
  Redux Store {
    Material-UI Theme {
      Router Connected to Store {
        Rendering of Component Specified by Given Route (coded to be our App, see routes/index.js)
      }
    }
  }
  This scoping is by convention / design of the libraries used.
*/
ReactDOM.render(
  <Provider store={store} context={ReactReduxContext}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history} context={ReactReduxContext}>
        {renderRoutes(routes)}
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
)
// increases speed in production; see registerServiceWorker.js
registerServiceWorker()
