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

import * as historyActions from 'modules/History'

jest.mock('../../util/apiCaller');

describe('History --- Actions tests ',()=>{
  beforeEach(() => {
    callApi.mockClear();
  });
  afterEach(() => {
    callApi.mockClear();
  })

  test('creates FETCH_REVISIONS_SUCCESS when fetching history has been done', async () => {
    const store = createMockStore({ hist: [] });
    // callApi('rules/script')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
        "message":"2021-02-10T17:13:15.826Z","id":"default",
        "rev":"403-43e4e2380aa45137b1a8282ec7bd33cf",
        "revisions":[{"rev":"403-43e4e2380aa45137b1a8282ec7bd33cf",
          "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
          "message":"2021-02-10T17:13:15.826Z"},
        {"rev":"402-3373bd36d1132d306519122a4072e574",
          "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
          "message":"2021-02-10T16:15:47.261Z"}]}
      )
    });
    const expectedActions = [
      { type: historyActions.FETCH_REVISIONS_ATTEMPT },
      { type: historyActions.FETCH_REVISIONS_SUCCESS, revisions: [{"rev":"403-43e4e2380aa45137b1a8282ec7bd33cf",
        "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
        "message":"2021-02-10T17:13:15.826Z"},
      {"rev":"402-3373bd36d1132d306519122a4072e574",
        "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
        "message":"2021-02-10T16:15:47.261Z"}]
      }
    ]
    return store.dispatch(historyActions.fetchRevisions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_REVISIONS_FAILURE when fetching history fails', async () => {
    const store = createMockStore({ hist: [] });
    // callApi('rules/script')
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}
      )
    });
    const expectedActions = [
      { type: historyActions.FETCH_REVISIONS_ATTEMPT },
      { type: historyActions.FETCH_REVISIONS_FAILURE
      }
    ]
    return store.dispatch(historyActions.fetchRevisions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

})
