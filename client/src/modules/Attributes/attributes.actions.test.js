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

import * as attributesActions from 'modules/Attributes'

jest.mock('../../util/apiCaller');

describe('Attributes --- Actions tests ',()=>{
  beforeEach(() => {
    callApi.mockClear();
  });
  afterEach(() => {
    callApi.mockClear();
  })

  test('FETCH_ATTRIBUTES_SUCCESS when fetchMdAttributes is complete', async () => {
    const store = createMockStore({ attributes: [] });
    // callApi('nodes')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":1,
        "rows":[{"id":"home_node",
          "rev":"13-6f792c0e4b4a91d611c5da8330c61add",
          "protocol":"https",
          "url":"https://whateverhost.org:6984",
          "node_name":"120",
          "username":"admin",
          "host":"whateverhost.org",
          "attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},
          "port":"6984","updated_on":"2019-08-02T18:20:54.346Z"}
        ]
      })
    });
    const expectedActions = [
      { type: attributesActions.FETCH_ATTRIBUTES_ATTEMPT },
      { type: attributesActions.FETCH_ATTRIBUTES_SUCCESS,
        mdAttributes: [{"attribute":"company","node_values":[{"nodelist":"120", "value":"keyw"}], "open":false},
          {"attribute":"office_type","node_values":[{"nodelist":"120", "value":"regional"}], "open":false},
          {"attribute":"classification","node_values":[{"nodelist":"120","value":"TOP SECRET"}], "open":false}]
      }
    ]
    return store.dispatch(attributesActions.fetchMdAttributes())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('FETCH_ATTRIBUTES_FAILURE when fetchMdAttributes fails ', async () => {
    const store = createMockStore({ attributes: [] });
    // callApi('nodes')
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    const expectedActions = [
      { type: attributesActions.FETCH_ATTRIBUTES_ATTEMPT },
      { type: attributesActions.FETCH_ATTRIBUTES_FAILURE }
    ]
    return store.dispatch(attributesActions.fetchMdAttributes())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })


})
