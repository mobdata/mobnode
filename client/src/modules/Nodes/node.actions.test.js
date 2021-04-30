import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';// React 16 Enzyme adapter
import Enzyme, { shallow, mount } from 'enzyme';
import Button from '@material-ui/core/Button'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk];

const createMockStore = configureMockStore(middlewares);
import regeneratorRuntime from 'regenerator-runtime'
import expect from 'expect'
import callApi, { apiCallReturn } from './../../util/apiCaller'

import * as nodesActions from 'modules/Nodes'

jest.mock('../../util/apiCaller');

describe('Nodes --- Actions tests ',()=>{
  beforeEach(() => {
    callApi.mockClear();
  });
  afterEach(() => {
    callApi.mockClear();
  })

  test('creates FETCH_NODES_SUCCESS when fetching nodes has been done', async () => {
    const store = createMockStore({ nodes: [] });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":1,
        "rows":[{"id":"home_node",
          "rev":"13-6f792c0e4b4a91d611c5da8330c61add",
          "protocol":"https",
          "url":"https://md-120.whateverhost.org:6984",
          "node_name":"120",
          "username":"admin",
          "host":"md-120.whateverhost.org",
          "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
          "port":"6984","updated_on":"2019-08-02T18:20:54.346Z"}
        ]
      })
    });
    const expectedActions = [
      { type: nodesActions.FETCH_NODES_ATTEMPT },
      { type: nodesActions.FETCH_NODES_SUCCESS, nodes: [{"id":"home_node",
        "rev":"13-6f792c0e4b4a91d611c5da8330c61add",
        "protocol":"https",
        "url":"https://md-120.whateverhost.org:6984",
        "node_name":"120",
        "username":"admin",
        "host":"md-120.whateverhost.org",
        "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
        "port":"6984","updated_on":"2019-08-02T18:20:54.346Z"}
      ] }
    ]
    return store.dispatch(nodesActions.fetchNodes())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_NODES_FAILURE when fetching nodes has failed', async () => {
    const store = createMockStore({ nodes: [] });

    callApi.mockReturnValueOnce({
      status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}) });

    const expectedActions = [
      { type: nodesActions.FETCH_NODES_ATTEMPT },
      { type: nodesActions.FETCH_NODES_FAILURE }
    ]
    return store.dispatch(nodesActions.fetchNodes())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('createNodes success ', async () => {
    const store = createMockStore({ nodes: [] });
    // This postTestData is used to call the createNodes post action method,
    // but not actually used in the return of the mocked response.
    // It does appear to match, but is only setup to have the required fields.
    const postTestData = [{"node_name":"180",
      "protocol":"https",
      "host":"md-180.whateverhost.org",
      "port":"6984",
      "username":"admin",
      "url":"https://md-180.whateverhost.org:6984",
      "attributes":{"company":"MRC","office_type":"regional","classification":"SECRET"},
      "password":"pswd"}]

    callApi.mockReturnValueOnce({
      status: 201,
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({"id":"a6b526edd6f258c33b39ceb5a3000d9f",
        "rev":"1-6eac4dcb8ebea06d5c79fe92dd2f4079",
        "node_name":"180",
        "protocol":"https",
        "host":"md-180.whateverhost.org",
        "port":"6984",
        "username":"admin",
        "password":"pswd",
        "url":"https://md-180.whateverhost.org:6984",
        "attributes":{"company":"MRC","office_type":"regional","classification":"SECRET"},
        "created_on":"2021-01-26T23:07:07.462Z"})
    });

    const expectedNodes = [{id:"a6b526edd6f258c33b39ceb5a3000d9f",
      rev:"1-6eac4dcb8ebea06d5c79fe92dd2f4079",
      node_name:"180",
      protocol:"https",
      host:"md-180.whateverhost.org",
      port:"6984",
      username:"admin",
      password:"pswd",
      url:"https://md-180.whateverhost.org:6984",
      attributes:{company:"MRC",office_type:"regional",classification:"SECRET"},
      created_on:"2021-01-26T23:07:07.462Z"}]
    return store.dispatch(nodesActions.createNodes(postTestData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Success!');
        expect(store.getActions()[1].type).toEqual('ADD_NODES');
        expect(store.getActions()[1].nodes).toEqual(expectedNodes);
      });
  })

  test('createNodes fail ', async () => {
    const store = createMockStore({ nodes: [] });
    // This postTestData is used to call the createNodes post action method,
    // but not actually used in the return of the mocked response.
    // It does appear to match, but is only setup to have the required fields.
    const postTestData = [{"node_name":"180",
      "protocol":"https",
      "host":"md-180.whateverhost.org",
      "port":"6984",
      "username":"admin",
      "url":"https://md-180.whateverhost.org:6984",
      "attributes":{"company":"MRC","office_type":"regional","classification":"SECRET"},
      "password":"pswd"}]

    callApi.mockReturnValueOnce({
      status: 400,
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({"errors": 'failed'})
    });

    return store.dispatch(nodesActions.createNodes(postTestData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Creating Node(s)');
      });
  })

  test('deleteNode success actions', async () => {
    const store = createMockStore({ nodes: [] });

    callApi.mockReturnValueOnce({
      status: 200,
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.deleteNodes([]))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('DELETE_NODES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Success!');
        expect(store.getActions()[2].type).toEqual('DELETE_NODES_SUCCESS');

      });
  })

  test('deleteNode fail actions', async () => {
    const store = createMockStore({ nodes: [] });

    callApi.mockReturnValueOnce({
      status: 400,
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.deleteNodes([]))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('DELETE_NODES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Error Deleting Nodes');
        expect(store.getActions()[2].type).toEqual('DELETE_NODES_FAILURE');

      });
  })

  test('Update_nodes - creates DIALOG indicating which nodes were updated, and REFRESH_NODES action- 1 node', async () => {
    const store = createMockStore({ nodes: [] });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"protocol":"https","url":"https://md-180.whateverhost.org:6984",
        "node_name":"180",
        "username":"admin","host":"md-180.whateverhost.org",
        "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
        "port":"6984","created_on":"2021-02-02T14:55:22.616Z","updated_on":"2021-02-02T15:09:01.449Z",
        "edit_password":"514e7a01f1b0ff858a887275a9000e28"})
    });
    const postUpdateData =     [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]

    return await store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Done!');
        expect(store.getActions()[0].message).toEqual('The following nodes were updated successfully.');
        expect(store.getActions()[0].list).toEqual(['180']);
        expect(store.getActions()[1].type).toEqual('REFRESH_NODES');
        expect(store.getActions().length === 2);

      });
  })

  test('Update_nodes - creates DIALOG indicating which nodes were updated, and REFRESH_NODES action - 2 nodes', async () => {
    const store = createMockStore({ nodes: [] });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"protocol":"https","url":"https://md-180.whateverhost.org:6984",
        "node_name":"180",
        "username":"admin","host":"md-180.whateverhost.org",
        "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
        "port":"6984","created_on":"2021-02-02T14:55:22.616Z","updated_on":"2021-02-02T15:09:01.449Z",
        "edit_password":"514e7a01f1b0ff858a887275a9000e28"})
    });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"protocol":"https","url":"https://md-180.whateverhost.org:6984",
        "node_name":"160",
        "username":"admin","host":"md-160.whateverhost.org",
        "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
        "port":"6984","created_on":"2021-02-02T14:55:22.616Z","updated_on":"2021-02-02T15:09:01.449Z",
        "edit_password":"514e7a01f1b0ff858a887275a9000e28"})
    });
    const postUpdateData =     [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"},
    {"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-160.whateverhost.org:6984",
      "node_name":"160",
      "username":"admin",
      "host":"md-160.whateverhost.org",
      "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]

    return await store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Done!');
        expect(store.getActions()[0].message).toEqual('The following nodes were updated successfully.');
        expect(store.getActions()[0].list).toEqual(['180', '160']);
        expect(store.getActions()[1].type).toEqual('REFRESH_NODES');
        expect(store.getActions().length === 2);

      });
  })

  test('Update_nodes - create DIALOG indicating error. No other actions are triggered. - 1 node', async () => {
    const store = createMockStore({ nodes: [] });

    const postUpdateData = [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Node 180');
        expect(store.getActions().length === 1);
      });
  })

  test('Update_nodes - creates 2 DIALOGS showing failure for each node. No other actions are triggered. - 2 node', async () => {
    const store = createMockStore({ nodes: [] });

    const postUpdateData =     [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"},
    {"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-160.whateverhost.org:6984",
      "node_name":"160",
      "username":"admin",
      "host":"md-160.whateverhost.org",
      "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Node 180');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Error Updating Node 160');
        expect(store.getActions().length === 2);
      });
  })

  test('Update_nodes - creates 1 DIALOG showing failure for first node, SUCCESS for 2nd node & REFRESH_NODES. - 2 nodes', async () => {
    const store = createMockStore({ nodes: [] });

    const postUpdateData =     [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"},
    {"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-160.whateverhost.org:6984",
      "node_name":"160",
      "username":"admin",
      "host":"md-160.whateverhost.org",
      "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"protocol":"https","url":"https://md-180.whateverhost.org:6984",
        "node_name":"160",
        "username":"admin","host":"md-160.whateverhost.org",
        "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
        "port":"6984","created_on":"2021-02-02T14:55:22.616Z","updated_on":"2021-02-02T15:09:01.449Z",
        "edit_password":"514e7a01f1b0ff858a887275a9000e28"})
    });

    return store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Node 180');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Done!');
        expect(store.getActions()[1].list).toEqual(['160']);
        expect(store.getActions()[2].type).toEqual('REFRESH_NODES');
        expect(store.getActions().length === 3);
      });
  })

  test('Update_nodes - creates 1 DIALOG indicating failure for second node. SUCCESS for first node and REFRESH_NODES. - 2 nodes', async () => {
    const store = createMockStore({ nodes: [] });

    const postUpdateData =     [{"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-180.whateverhost.org:6984",
      "node_name":"180",
      "username":"admin",
      "host":"md-180.whateverhost.org",
      "attributes":{"company":"mrc","office_type":"regional","classification":"SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"},
    {"id":"514e7a01f1b0ff858a887275a9000e28","rev":"2-6229abf525a46caf65d4090c2fea21d9",
      "protocol":"https",
      "url":"https://md-160.whateverhost.org:6984",
      "node_name":"160",
      "username":"admin",
      "host":"md-160.whateverhost.org",
      "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
      "port":"6984",
      "created_on":"2021-02-02T14:55:22.616Z",
      "updated_on":"2021-02-02T14:55:54.843Z","edit_password":"514e7a01f1b0ff858a887275a9000e28"}]
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"protocol":"https","url":"https://md-180.whateverhost.org:6984",
        "node_name":"160",
        "username":"admin","host":"md-160.whateverhost.org",
        "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
        "port":"6984","created_on":"2021-02-02T14:55:22.616Z","updated_on":"2021-02-02T15:09:01.449Z",
        "edit_password":"514e7a01f1b0ff858a887275a9000e28"})
    });
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.updateNodes(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Node 160');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Done!');
        expect(store.getActions()[1].list).toEqual(['180']);
        expect(store.getActions()[2].type).toEqual('REFRESH_NODES');
        expect(store.getActions().length === 3);
      });
  })

  test('attemptPasswordChange success actions', async () => {
    const store = createMockStore({ nodes: [] });

    apiCallReturn.mockReturnValueOnce({
      result: 'SUCCESS',
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    return store.dispatch(nodesActions.attemptPasswordChange('anyIdNumber', 'oldPassword', 'newPassword'))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Success!');
        expect(store.getActions()[0].message).toEqual('Password changed successfully.');
      });
  })

  test('attemptPasswordChange failed actions', async () => {
    const store = createMockStore({ nodes: [] });

    apiCallReturn.mockReturnValueOnce({
      result: 'NOTSUCCESS',
      headers: {'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    const result = await store.dispatch(nodesActions.attemptPasswordChange('anyIdNumber', 'oldPassword', 'newPassword'));
    expect(result).toBeFalsy();

  })

//  test('verifyPassword success actions', async () => {
//    const store = createMockStore({ nodes: [] });
//
//    apiCallReturn.mockReturnValueOnce({
//      result: 'SUCCESS',
//      headers: {'content-type': 'application/json' },
//      json: () => Promise.resolve({})
//    });
//
//    return store.dispatch(nodesActions.verifyPassword('anyIdNumber', 'password'))
//      .then(() => {
//        console.log(JSON.stringify(store.getActions()));
//        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
//        expect(store.getActions()[0].title).toEqual('Success!');
//        expect(store.getActions()[0].message).toEqual('Password changed successfully.');
//      });
//  })
// handleDuplicates, handleIncomplete, and handleNodesFile functions all kick off dialogs that require input from the
// user to run the decided action.  Mocking these dialogs doesn't work because the accept and closeActions are not
// separate functions that can be called from here.
})
