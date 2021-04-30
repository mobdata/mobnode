import React from 'react' // component rendering
import { Redirect } from 'react-router' // for redirecting to the rules page if the user goes to base /
import App from 'App' // specified to be rendered here

// the various page endpoints for our app
import EditDocPage from 'modules/EditDoc'
import NodePage from 'modules/Nodes'
import RulePage from 'modules/Rule'
import ConditionPage from 'modules/Conditions'
import HistoryPage from 'modules/History'
import Show404 from 'components/Show404'

// fetch any custom prefix to paths
const { REACT_APP_PATH_PREFIX } = process.env
const pathPrefix = (typeof REACT_APP_PATH_PREFIX !== 'undefined' && REACT_APP_PATH_PREFIX !== '')
  ? `/${REACT_APP_PATH_PREFIX}`
  : ''

// default to displaying the rule page if the user just navigates to the host itself
const defaultPath = `${pathPrefix}/rules`
const DefaultRoute = () => <Redirect to={defaultPath} />

const routes = [
  {
    // first renderRoutes(routes) will render our App and pass the routes array to App as a prop
    // App's renderRoutes(routes) then displays the page specified by the current path
    component: App,

    // defines what components to display at all URL endpoints of our app
    routes: [
      {
        path: `${pathPrefix}/`,
        exact: true,
        component: DefaultRoute,
      },
      {
        path: `${pathPrefix}/nodes`,
        exact: true,
        component: NodePage,
      },
      {
        path: `${pathPrefix}/rules`,
        exact: true,
        component: RulePage,
      },
      {
        path: `${pathPrefix}/conditions`,
        exact: true,
        component: ConditionPage,
      },
      {
        path: `${pathPrefix}/history`,
        exact: true,
        component: HistoryPage,
      },
      {
        path: `${pathPrefix}/editdoc`,
        exact: true,
        component: EditDocPage,
      },
      {
        // show a 404 page if the path doesn't match any of the above
        component: Show404,
      },
    ],
  },
]

export default routes
