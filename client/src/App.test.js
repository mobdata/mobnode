import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';// React 16 Enzyme adapter

const createHistory = require("history").createBrowserHistory
import { ConnectedRouter } from 'connected-react-router'
import Enzyme, { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from './createStore'
const history = createHistory()
import routes from './routes' // defines which components render based on our current route/URL
import { renderRoutes } from 'react-router-config' // provides rendering-by-tab, i.e. routing


Enzyme.configure({ adapter: new Adapter() })
jest.mock('@mobdata/classification-banner', () => ({
  doSomething: jest.fn()
}))

const store = configureStore(history)
import App from './App';

describe('App mount tests', () => {

  beforeEach(() => {
    // Avoid `attachTo: document.body` Warning
    const div = document.createElement('div');
    div.setAttribute('id', 'container');
    document.body.appendChild(div);
  });

  afterEach(() => {
    const div = document.getElementById('container');
    if (div) {
      document.body.removeChild(div);
    }
  });

  test('renders defaultPath', () => {
    const pathPrefix = "";
    const defaultPath = `${pathPrefix}/rules`
    const DefaultRoute = () => <Redirect to={defaultPath} />
    const renderedComponent = {"compare":null,"displayName":"Connect(App)"}
    const renderedRoutes =  {"path":"/rules","exact":true, "component":{"propTypes":{},"displayName":"WithStyles(Connect(App))"}}
    const otherRoutes = {"routes": [
      {"path":"/nodes","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(Connect(NodePage))"}},
      {"path":"/rules","exact":true, "component":{"propTypes":{},"displayName":"WithStyles(Connect(App))"}},
      {"path":"/conditions","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(Connect(ConditionPage))"}},
      {"path":"/history","exact":true,"component":{"compare":null,"displayName":"Connect(HistoryPage)"}},
      {"path":"/editdoc","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(EditDocPage)"}}
    ]}
    const renderedHistory = {"history":
                      {"length":1,"action":"REPLACE","location":
                       {"pathname":"/rules","search":"","hash":"","key":"h2zx6d"}
                      },
    "location":{"pathname":"/rules","search":"","hash":"","key":"h2zx6d"},
    "match":{"path":"/","url":"/","params":{},"isExact":false},
    "route":{"component":{"compare":null,"displayName":"Connect(App)"},
      "routes":[{"path":"/","exact":true},
        {"path":"/nodes","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(Connect(NodePage))"}},
        {"path":"/rules","exact":true},
        {"path":"/conditions","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(Connect(ConditionPage))"}},
        {"path":"/history","exact":true,"component":{"compare":null,"displayName":"Connect(HistoryPage)"}},
        {"path":"/editdoc","exact":true,"component":{"propTypes":{},"displayName":"WithStyles(EditDocPage)"}}
      ]
    },"activeTab":"rules"}

    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            component= {renderedComponent}
            route= {renderedRoutes, otherRoutes}
            history= {renderedHistory}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders nodePath', () => {
    const pathPrefix = "";
    const nodePath = `${pathPrefix}/nodes`
    const NodePage = () => <Redirect to={nodePath} />
    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            route= {{ path: `/nodes`,
              exact: true,
              component: NodePage, }}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

  test('renders rulePath', () => {
    const pathPrefix = "";
    const rulePath = `${pathPrefix}/rules`
    const RulePage = () => <Redirect to={rulePath} />
    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            route= {{ path: `/nodes`,
              exact: true,
              component: RulePage, }}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

  test('renders conditionPath', () => {
    const pathPrefix = "";
    const conditionPath = `${pathPrefix}/conditions`
    const ConditionPage = () => <Redirect to={conditionPath} />
    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            route= {{ path: `/conditions`,
              exact: true,
              component: ConditionPage, }}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

  test('renders historyPath', () => {
    const pathPrefix = "";
    const historyPath = `${pathPrefix}/history`
    const HistoryPage = () => <Redirect to={historyPath} />
    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            route= {{ path: `/history`,
              exact: true,
              component: HistoryPage, }}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

  test('renders Editdoc', () => {
    const pathPrefix = "";
    const editdocPath = `${pathPrefix}/editdoc`
    const EditDocPage = () => <Redirect to={editdocPath} />
    const wrapper = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history} >
          <App
            route= {{ path: `/editdoc`,
              exact: true,
              component: EditDocPage, }}
          />
        </ConnectedRouter>
      </Provider>, { attachTo: document.getElementById('container') });
    expect(toJson(wrapper)).toMatchSnapshot();

  });

});
