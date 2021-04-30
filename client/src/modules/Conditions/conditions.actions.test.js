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

import * as conditionsActions from 'modules/Conditions'
import { reloadConditions } from './condition.actions'


jest.mock('../../util/apiCaller');

describe('Conditions --- Actions tests ',()=>{
  beforeEach(() => {
    callApi.mockClear();
  });
  afterEach(() => {
    callApi.mockClear();
  })

  test('creates FETCH_CONDITIONS_SUCCESS when fetching conditions has been done', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":4,
        "rows":[{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
          {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
          {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
          {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}]}
      )
    });
    const expectedActions = [
      { type: conditionsActions.FETCH_CONDITIONS_ATTEMPT },
      { type: conditionsActions.FETCH_CONDITIONS_SUCCESS, conditions: [{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
        {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
        {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
        {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}]
      }
    ]
    return store.dispatch(conditionsActions.fetchConditions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_CONDITIONS_FAILURE when fetching conditions has failed', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    const expectedActions = [
      { type: conditionsActions.FETCH_CONDITIONS_ATTEMPT },
      { type: conditionsActions.FETCH_CONDITIONS_FAILURE }
    ]
    return store.dispatch(conditionsActions.fetchConditions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates REFRESH_CONDITIONS when reloading conditions is done', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":4,
        "rows":[{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
          {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
          {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
          {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}]}
      )
    });
    const expectedActions = [
      { type: conditionsActions.REFRESH_CONDITIONS,
        conditions: [{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
          {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
          {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
          {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}],
        unchanged: true }
    ]
    return store.dispatch(reloadConditions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_CONDITIONS_FAILURE when reloading conditions fails', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}
      )
    });
    const expectedActions = [
      { type: conditionsActions.FETCH_CONDITIONS_FAILURE }
    ]
    return store.dispatch(reloadConditions())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('Update_conditions - All api calls succeed', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi("md_config")
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":1,"rows":[{"id":"conditions","rev":"132-64220a366bf2466c0f0f7400290648aa","conditions":[{"condition_text":"target:company isnot \"google\"","on_status":false},{"condition_text":"target:company isnot \"megamind\"","on_status":true},{"condition_text":"target:company isnot \"competitor\"","on_status":false},{"condition_text":"package-meta:number lt 40","on_status":false},{"condition_text":"package-meta:number gt 5","on_status":false}]}]}
      )
    });
    //callApi('conditions', 'put', newdoc)
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"rows":{"ok":true,"id":"conditions","rev":"133-149ce038925e9311c5bfd787519199bc"}})
    });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":4,
        "rows":[{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
          {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
          {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
          {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}]}
      )
    });
    const postUpdateData =     [{"id": "it doesn't really matter what this postData looks like"}]

    return await store.dispatch(conditionsActions.updateConditions(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Success!');
        expect(store.getActions()[0].message).toEqual('Changes made successfully.');
        expect(store.getActions()[1].type).toEqual('REFRESH_CONDITIONS');
        expect(store.getActions().length === 2);

      });
  })

  test('Update_conditions - Md_config call fails ', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi("md_config") fails
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    const postUpdateData =     [{"id": "it doesn't really matter what this postData looks like"}]

    return await store.dispatch(conditionsActions.updateConditions(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Conditions');
        expect(store.getActions()[0].message).toEqual('There was a problem updating the conditions. Details: md_config call failed.');
        expect(store.getActions().length === 1);

      });
  })

  test('Update_conditions - put conditions call fails ', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi("md_config")
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":1,"rows":[{"id":"conditions","rev":"132-64220a366bf2466c0f0f7400290648aa","conditions":[{"condition_text":"target:company isnot \"google\"","on_status":false},{"condition_text":"target:company isnot \"megamind\"","on_status":true},{"condition_text":"target:company isnot \"competitor\"","on_status":false},{"condition_text":"package-meta:number lt 40","on_status":false},{"condition_text":"package-meta:number gt 5","on_status":false}]}]}
      )
    });
    //callApi('conditions', 'put', newdoc)
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":4,
        "rows":[{"id":"0","on_status":false,"condition_text":"target:company isnot \"google\""},
          {"id":"2","on_status":false,"condition_text":"target:company isnot \"competitor\""},
          {"id":"3","on_status":false,"condition_text":"package-meta:number lt 40"},
          {"id":"4","on_status":false,"condition_text":"package-meta:number gt 5"}]}
      )
    });

    const postUpdateData =     [{"id": "it doesn't really matter what this postData looks like"}]

    return await store.dispatch(conditionsActions.updateConditions(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Error Updating Conditions');
        expect(store.getActions()[0].message).toEqual('There was a problem updating the conditions.  Details: Put conditions failed.');
        expect(store.getActions()[1].type).toEqual('REFRESH_CONDITIONS');
        expect(store.getActions().length === 2);

      });
  })

  test('Update_conditions - final conditions refresh fails ', async () => {
    const store = createMockStore({ conditions: [] });
    // callApi("md_config")
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"count":1,"rows":[{"id":"conditions","rev":"132-64220a366bf2466c0f0f7400290648aa","conditions":[{"condition_text":"target:company isnot \"google\"","on_status":false},{"condition_text":"target:company isnot \"megamind\"","on_status":true},{"condition_text":"target:company isnot \"competitor\"","on_status":false},{"condition_text":"package-meta:number lt 40","on_status":false},{"condition_text":"package-meta:number gt 5","on_status":false}]}]}
      )
    });
    //callApi('conditions', 'put', newdoc)
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"rows":{"ok":true,"id":"conditions","rev":"133-149ce038925e9311c5bfd787519199bc"}})
    });
    // callApi('conditions')
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({})
    });

    const postUpdateData =     [{"id": "it doesn't really matter what this postData looks like"}]

    return await store.dispatch(conditionsActions.updateConditions(postUpdateData))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[0].title).toEqual('Success!');
        expect(store.getActions()[0].message).toEqual('Changes made successfully.');
        expect(store.getActions()[1].type).toEqual('FETCH_CONDITIONS_FAILURE');
        expect(store.getActions().length === 2);

      });
  })

  test('creates DELETE_CONDITIONS_SUCCESS when delete_conditions is called', async () => {
    const store = createMockStore({ conditions: [] });

    const expectedActions = [{
      "deletedConditions": [{"id": "it doesn't really matter what this postData looks like"}],
      type: conditionsActions.DELETE_CONDITIONS_SUCCESS,
      "unchanged": false
    }]
    const postUpdateData =     [{"id": "it doesn't really matter what this postData looks like"}]

    return store.dispatch(conditionsActions.deleteConditions(postUpdateData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

})
