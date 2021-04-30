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

import * as rulesActions from 'modules/Rule'

jest.mock('../../util/apiCaller');

describe('Rules --- Actions tests ',()=>{
  beforeEach(() => {
    callApi.mockClear();
  });
  afterEach(() => {
    callApi.mockClear();
  })

  test('creates FETCH_SCRIPTS_SUCCESS when fetching rules has been done', async () => {
    const store = createMockStore({ rule: [] });
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
      { type: rulesActions.FETCH_SCRIPT_ATTEMPT },
      { type: rulesActions.FETCH_SCRIPT_SUCCESS, script: {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
        "message":"2021-02-10T17:13:15.826Z","id":"default",
        "rev":"403-43e4e2380aa45137b1a8282ec7bd33cf",
        "revisions":[{"rev":"403-43e4e2380aa45137b1a8282ec7bd33cf",
          "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
          "message":"2021-02-10T17:13:15.826Z"},
        {"rev":"402-3373bd36d1132d306519122a4072e574",
          "script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"",
          "message":"2021-02-10T16:15:47.261Z"}]}
      }
    ]
    return store.dispatch(rulesActions.fetchScript())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_SCRIPT_FAILURE when fetching script has failed', async () => {
    const store = createMockStore({ rule: [] });

    callApi.mockReturnValueOnce({
      status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}) });

    const expectedActions = [
      { type: rulesActions.FETCH_SCRIPT_ATTEMPT },
      { type: rulesActions.FETCH_SCRIPT_FAILURE }
    ]
    return store.dispatch(rulesActions.fetchScript())
      .then(() => {
        expect(store.getActions()[0].type).toEqual('FETCH_SCRIPT_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('FETCH_SCRIPT_FAILURE');
        expect(store.getActions()[1].errorHandler.message).toEqual('Unable to fetch scripts');
      });
  })

  test('creates FETCH_DBS_SUCCESS when fetching dbs has been done', async () => {
    const store = createMockStore({ rule: [] });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"dbs":["_replicator","_users","db","devdb1","devdb2","devdb3","garbage_dump","md_config","md_home","md_nodes","md_rules","multi-type_attributes","reppin","test1","test114","test115","test118","test119"]}
      )
    });
    const expectedActions = [
      { type: rulesActions.FETCH_DBS_ATTEMPT },
      { type: rulesActions.FETCH_DBS_SUCCESS, dbs: ["_replicator","_users","db","devdb1","devdb2","devdb3","garbage_dump","md_config","md_home","md_nodes","md_rules","multi-type_attributes","reppin","test1","test114","test115","test118","test119"]
      }
    ]
    return store.dispatch(rulesActions.fetchDbs())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })


  test('creates FETCH_DBS_FAILURE when fetching dbs has failed', async () => {
    const store = createMockStore({ rule: [] });

    callApi.mockReturnValueOnce({
      status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}) });

    const expectedActions = [
      { type: rulesActions.FETCH_DBS_ATTEMPT },
      { type: rulesActions.FETCH_DBS_FAILURE }
    ]
    return store.dispatch(rulesActions.fetchDbs())
      .then(() => {
        expect(store.getActions()[0].type).toEqual('FETCH_DBS_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('FETCH_DBS_FAILURE');
        expect(store.getActions()[1].errorHandler.message).toEqual('Unable to fetch databases');
      });
  })

  test('creates FETCH_HOME_SUCCESS when fetching home has been done', async () => {
    const store = createMockStore({ rule: [] });
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"name":"120"})

    });
    const expectedActions = [
      { type: rulesActions.FETCH_HOME_ATTEMPT },
      { type: rulesActions.FETCH_HOME_SUCCESS, home: "120"
      }
    ]
    return store.dispatch(rulesActions.fetchHome())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  })

  test('creates FETCH_HOME_FAILURE when fetching home has failed', async () => {
    const store = createMockStore({ rule: [] });

    callApi.mockReturnValueOnce({
      status: 500,
      message: 'Mocked fail',
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}) });

    const expectedActions = [
      { type: rulesActions.FETCH_HOME_ATTEMPT },
      { type: rulesActions.FETCH_HOME_FAILURE }
    ]
    return store.dispatch(rulesActions.fetchHome())
      .then(() => {
        expect(store.getActions()[0].type).toEqual('FETCH_HOME_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('FETCH_HOME_FAILURE');
        expect(store.getActions()[1].errorHandler.message).toEqual('Unable to fetch home: Mocked fail');
      });
  })

  test('creates PUSH_RULES_SUCCESS, FETCH_SCRIPT_SUCCESS upon pushing rules ', async () => {
    const store = createMockStore({ rule: [] });
    //callApi('rules', 'post', rules)
    // Post to push Rules fails
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve([{"ok":true,"id":"e764ac7445cadda35afe0e3356000089","rev":"1-1f0a7746445a001c0e3155c88fea53d2"}]
      )
    });
    //callApi('rules/script', 'post', script)
    callApi.mockReturnValueOnce({status: 201,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"id":"default","rev":"404-3fa8441b7aa6c552e15431d34cde44bb","script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","message":"2021-02-23T18:47:50.226Z"}
      )
    });
    //callApi('rules/script')
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
    const myPostDataRules = {"rules":[{"db":"devdb2","source":"120","target":"121","hash":"2dc89f306ed1b073","continuous":true,"filter":"120_to_121_filter : function(doc,req) {var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"0eba10c0fb6f5916355366fc63002ea3\",\"rev\":\"3-31b80d53cf850f2c2e431175ac9e4b51\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"121\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"office_type\":\"headquarters\",\"classification\":\"TOP SECRET\",\"company\":\"Mario Batali\"},\"port\":\"6984\",\"created_on\":\"2019-11-05T19:24:47.231Z\",\"updated_on\":\"2019-12-10T16:08:38.006Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"13-6f792c0e4b4a91d611c5da8330c61add\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"120\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"company\":\"keyw\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2019-08-02T18:20:54.346Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"_deleted\"] && doc[\"_deleted\"] === true) {log(\"REPLICATING deletion of doc id: \" + doc[\"_id\"] + \", rev: \" + doc[\"_rev\"]); return true; }if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}if (!(typeof targetNode[\"attributes\"][\"company\"] !== \"undefined\" && targetNode[\"attributes\"][\"company\"] !== \"megamind\")) {log(\"REPLICATION FILTER FAILS doc \" + doc[\"_id\"] + \" on expression test.\"); return false;}return true;}"}]}
    const myPostDataScript = {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","rev":"403-43e4e2380aa45137b1a8282ec7bd33cf","nodes":{"111": {"id":"1642636df5a0f0935f8a3bc7e300591a","rev":"3-4a08280d78bddb8528d742a53b058cee","protocol":"https","url":"https://whateverhost.org:6984","node_name":"111","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2019-11-05T19:24:47.222Z","updated_on":"2020-02-27T18:14:28.249Z","edit_password":"1642636df5a0f0935f8a3bc7e300591a"}, "114": {"id":"453812bc49319fd20d8101519601c9cb","rev":"1-7e1d3ac57eb04c89914c0856eee0d449","protocol":"https","url":"https://whateverhost.org:6984","node_name":"114","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2020-12-10T18:49:59.820Z","edit_password":"453812bc49319fd20d8101519601c9cb"},"120":{"id":"home_node","rev":"13-6f792c0e4b4a91d611c5da8330c61add","protocol":"https","url":"https://whateverhost.org:6984","node_name":"120","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},"port":"6984","updated_on":"2019-08-02T18:20:54.346Z","edit_password":"home_node"}},"message":"2021-02-23T18:47:50.226Z"}

    return store.dispatch(rulesActions.pushRules(myPostDataRules, myPostDataScript))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('PUSH_RULES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('PUSH_SCRIPT_ATTEMPT');
        expect(store.getActions()[2].type).toEqual('PUSH_SCRIPT_SUCCESS');
        expect(store.getActions()[3].type).toEqual('FETCH_SCRIPT_ATTEMPT');
        expect(store.getActions()[4].type).toEqual('FETCH_SCRIPT_SUCCESS');
        expect(store.getActions()[5].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[5].title).toEqual('Success!');
        expect(store.getActions()[5].message).toEqual('Rules updated successfully.');
        expect(store.getActions()[6].type).toEqual('PUSH_RULES_SUCCESS');

      });
  })

  test('creates PUSH_RULES_FAILURE upon Post rules fail ', async () => {
    const store = createMockStore({ rule: [] });
    //callApi('rules', 'post', rules)
    // Post to push Rules fails
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve([]
      )
    });

    const myPostDataRules = {"rules":[{"db":"devdb2","source":"120","target":"121","hash":"2dc89f306ed1b073","continuous":true,"filter":"120_to_121_filter : function(doc,req) {var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"0eba10c0fb6f5916355366fc63002ea3\",\"rev\":\"3-31b80d53cf850f2c2e431175ac9e4b51\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"121\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"office_type\":\"headquarters\",\"classification\":\"TOP SECRET\",\"company\":\"Mario Batali\"},\"port\":\"6984\",\"created_on\":\"2019-11-05T19:24:47.231Z\",\"updated_on\":\"2019-12-10T16:08:38.006Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"13-6f792c0e4b4a91d611c5da8330c61add\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"120\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"company\":\"keyw\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2019-08-02T18:20:54.346Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"_deleted\"] && doc[\"_deleted\"] === true) {log(\"REPLICATING deletion of doc id: \" + doc[\"_id\"] + \", rev: \" + doc[\"_rev\"]); return true; }if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}if (!(typeof targetNode[\"attributes\"][\"company\"] !== \"undefined\" && targetNode[\"attributes\"][\"company\"] !== \"megamind\")) {log(\"REPLICATION FILTER FAILS doc \" + doc[\"_id\"] + \" on expression test.\"); return false;}return true;}"}]}
    const myPostDataScript = {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","rev":"403-43e4e2380aa45137b1a8282ec7bd33cf","nodes":{"111": {"id":"1642636df5a0f0935f8a3bc7e300591a","rev":"3-4a08280d78bddb8528d742a53b058cee","protocol":"https","url":"https://whateverhost.org:6984","node_name":"111","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2019-11-05T19:24:47.222Z","updated_on":"2020-02-27T18:14:28.249Z","edit_password":"1642636df5a0f0935f8a3bc7e300591a"}, "114": {"id":"453812bc49319fd20d8101519601c9cb","rev":"1-7e1d3ac57eb04c89914c0856eee0d449","protocol":"https","url":"https://whateverhost.org:6984","node_name":"114","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2020-12-10T18:49:59.820Z","edit_password":"453812bc49319fd20d8101519601c9cb"},"120":{"id":"home_node","rev":"13-6f792c0e4b4a91d611c5da8330c61add","protocol":"https","url":"https://whateverhost.org:6984","node_name":"120","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},"port":"6984","updated_on":"2019-08-02T18:20:54.346Z","edit_password":"home_node"}},"message":"2021-02-23T18:47:50.226Z"}

    return store.dispatch(rulesActions.pushRules(myPostDataRules, myPostDataScript))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('PUSH_RULES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('PUSH_RULES_FAILURE');

      });
  })

  test('creates PUSH_RULES_FAILURE upon Post Script fail ', async () => {
    const store = createMockStore({ rule: [] });
    //callApi('rules', 'post', rules)
    // Post to push Rules fails
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve([{"ok":true,"id":"e764ac7445cadda35afe0e3356000089","rev":"1-1f0a7746445a001c0e3155c88fea53d2"}])
    });
    //callApi('rules/script', 'post', script)
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"ok":false,"message":"request to *** failed, reason: connect ECONNREFUSED 54.91.207.167:6984"}
      )
    });
    const myPostDataRules = {"rules":[{"db":"devdb2","source":"120","target":"121","hash":"2dc89f306ed1b073","continuous":true,"filter":"120_to_121_filter : function(doc,req) {var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"0eba10c0fb6f5916355366fc63002ea3\",\"rev\":\"3-31b80d53cf850f2c2e431175ac9e4b51\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"121\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"office_type\":\"headquarters\",\"classification\":\"TOP SECRET\",\"company\":\"Mario Batali\"},\"port\":\"6984\",\"created_on\":\"2019-11-05T19:24:47.231Z\",\"updated_on\":\"2019-12-10T16:08:38.006Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"13-6f792c0e4b4a91d611c5da8330c61add\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"120\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"company\":\"keyw\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2019-08-02T18:20:54.346Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"_deleted\"] && doc[\"_deleted\"] === true) {log(\"REPLICATING deletion of doc id: \" + doc[\"_id\"] + \", rev: \" + doc[\"_rev\"]); return true; }if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}if (!(typeof targetNode[\"attributes\"][\"company\"] !== \"undefined\" && targetNode[\"attributes\"][\"company\"] !== \"megamind\")) {log(\"REPLICATION FILTER FAILS doc \" + doc[\"_id\"] + \" on expression test.\"); return false;}return true;}"}]}
    const myPostDataScript = {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","rev":"403-43e4e2380aa45137b1a8282ec7bd33cf","nodes":{"111": {"id":"1642636df5a0f0935f8a3bc7e300591a","rev":"3-4a08280d78bddb8528d742a53b058cee","protocol":"https","url":"https://whateverhost.org:6984","node_name":"111","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2019-11-05T19:24:47.222Z","updated_on":"2020-02-27T18:14:28.249Z","edit_password":"1642636df5a0f0935f8a3bc7e300591a"}, "114": {"id":"453812bc49319fd20d8101519601c9cb","rev":"1-7e1d3ac57eb04c89914c0856eee0d449","protocol":"https","url":"https://whateverhost.org:6984","node_name":"114","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2020-12-10T18:49:59.820Z","edit_password":"453812bc49319fd20d8101519601c9cb"},"120":{"id":"home_node","rev":"13-6f792c0e4b4a91d611c5da8330c61add","protocol":"https","url":"https://whateverhost.org:6984","node_name":"120","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},"port":"6984","updated_on":"2019-08-02T18:20:54.346Z","edit_password":"home_node"}},"message":"2021-02-23T18:47:50.226Z"}

    return store.dispatch(rulesActions.pushRules(myPostDataRules, myPostDataScript))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('PUSH_RULES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('PUSH_SCRIPT_ATTEMPT');
        expect(store.getActions()[2].type).toEqual('PUSH_SCRIPT_FAILURE');
        expect(store.getActions()[3].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[4].type).toEqual('PUSH_RULES_FAILURE');

      });
  })

  test('creates PUSH_RULES_SUCCESS, FETCH_SCRIPT_SUCCESS upon pushing rules even if fetchScript fails', async () => {
    const store = createMockStore({ rule: [] });
    //callApi('rules', 'post', rules)
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve([{"ok":true,"id":"e764ac7445cadda35afe0e3356000089","rev":"1-1f0a7746445a001c0e3155c88fea53d2"}]
      )
    });
    //callApi('rules/script', 'post', script)
    callApi.mockReturnValueOnce({status: 201,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({"id":"default","rev":"404-3fa8441b7aa6c552e15431d34cde44bb","script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","message":"2021-02-23T18:47:50.226Z"}
      )
    });
    //fetchScript callApi('rules/script')
    // fetchScript fails
    callApi.mockReturnValueOnce({status: 500,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve({}
      )
    });
    const myPostDataRules = {"rules":[{"db":"devdb2","source":"120","target":"121","hash":"2dc89f306ed1b073","continuous":true,"filter":"120_to_121_filter : function(doc,req) {var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"0eba10c0fb6f5916355366fc63002ea3\",\"rev\":\"3-31b80d53cf850f2c2e431175ac9e4b51\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"121\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"office_type\":\"headquarters\",\"classification\":\"TOP SECRET\",\"company\":\"Mario Batali\"},\"port\":\"6984\",\"created_on\":\"2019-11-05T19:24:47.231Z\",\"updated_on\":\"2019-12-10T16:08:38.006Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"13-6f792c0e4b4a91d611c5da8330c61add\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"120\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"company\":\"keyw\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2019-08-02T18:20:54.346Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"_deleted\"] && doc[\"_deleted\"] === true) {log(\"REPLICATING deletion of doc id: \" + doc[\"_id\"] + \", rev: \" + doc[\"_rev\"]); return true; }if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}if (!(typeof targetNode[\"attributes\"][\"company\"] !== \"undefined\" && targetNode[\"attributes\"][\"company\"] !== \"megamind\")) {log(\"REPLICATION FILTER FAILS doc \" + doc[\"_id\"] + \" on expression test.\"); return false;}return true;}"}]}
    const myPostDataScript = {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","rev":"403-43e4e2380aa45137b1a8282ec7bd33cf","nodes":{"111": {"id":"1642636df5a0f0935f8a3bc7e300591a","rev":"3-4a08280d78bddb8528d742a53b058cee","protocol":"https","url":"https://whateverhost.org:6984","node_name":"111","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2019-11-05T19:24:47.222Z","updated_on":"2020-02-27T18:14:28.249Z","edit_password":"1642636df5a0f0935f8a3bc7e300591a"}, "114": {"id":"453812bc49319fd20d8101519601c9cb","rev":"1-7e1d3ac57eb04c89914c0856eee0d449","protocol":"https","url":"https://whateverhost.org:6984","node_name":"114","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2020-12-10T18:49:59.820Z","edit_password":"453812bc49319fd20d8101519601c9cb"},"120":{"id":"home_node","rev":"13-6f792c0e4b4a91d611c5da8330c61add","protocol":"https","url":"https://whateverhost.org:6984","node_name":"120","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},"port":"6984","updated_on":"2019-08-02T18:20:54.346Z","edit_password":"home_node"}},"message":"2021-02-23T18:47:50.226Z"}

    return store.dispatch(rulesActions.pushRules(myPostDataRules, myPostDataScript))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('PUSH_RULES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('PUSH_SCRIPT_ATTEMPT');
        expect(store.getActions()[2].type).toEqual('PUSH_SCRIPT_SUCCESS');
        expect(store.getActions()[3].type).toEqual('FETCH_SCRIPT_ATTEMPT');
        expect(store.getActions()[4].type).toEqual('FETCH_SCRIPT_FAILURE');
        expect(store.getActions()[5].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[5].title).toEqual('Success!');
        expect(store.getActions()[5].message).toEqual('Rules updated successfully.');
        expect(store.getActions()[6].type).toEqual('PUSH_RULES_SUCCESS');

      });
  })

  test('creates PUSH_RULES_SUCCESS, FETCH_SCRIPT_SUCCESS upon pushing rules. No Message in script. ', async () => {
    const store = createMockStore({ rule: [] });
    //callApi('rules', 'post', rules)
    callApi.mockReturnValueOnce({status: 200,
      headers: { 'content-type': 'application/json' },
      json: () => Promise.resolve([{"ok":true,"id":"e764ac7445cadda35afe0e3356000089","rev":"1-1f0a7746445a001c0e3155c88fea53d2"}]
      )
    });

    const myPostDataRules = {"rules":[{"db":"devdb2","source":"120","target":"121","hash":"2dc89f306ed1b073","continuous":true,"filter":"120_to_121_filter : function(doc,req) {var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"0eba10c0fb6f5916355366fc63002ea3\",\"rev\":\"3-31b80d53cf850f2c2e431175ac9e4b51\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"121\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"office_type\":\"headquarters\",\"classification\":\"TOP SECRET\",\"company\":\"Mario Batali\"},\"port\":\"6984\",\"created_on\":\"2019-11-05T19:24:47.231Z\",\"updated_on\":\"2019-12-10T16:08:38.006Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"13-6f792c0e4b4a91d611c5da8330c61add\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@whateverhost.org:6984\",\"node_name\":\"120\",\"username\":\"admin\",\"host\":\"whateverhost.org\",\"attributes\":{\"company\":\"keyw\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2019-08-02T18:20:54.346Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"_deleted\"] && doc[\"_deleted\"] === true) {log(\"REPLICATING deletion of doc id: \" + doc[\"_id\"] + \", rev: \" + doc[\"_rev\"]); return true; }if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}if (!(typeof targetNode[\"attributes\"][\"company\"] !== \"undefined\" && targetNode[\"attributes\"][\"company\"] !== \"megamind\")) {log(\"REPLICATION FILTER FAILS doc \" + doc[\"_id\"] + \" on expression test.\"); return false;}return true;}"}]}
    const myPostDataScript = {"script":"send \"devdb3\" to \"111\",\nsend \"devdb3\" to \"114\"","rev":"403-43e4e2380aa45137b1a8282ec7bd33cf","nodes":{"111": {"id":"1642636df5a0f0935f8a3bc7e300591a","rev":"3-4a08280d78bddb8528d742a53b058cee","protocol":"https","url":"https://whateverhost.org:6984","node_name":"111","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2019-11-05T19:24:47.222Z","updated_on":"2020-02-27T18:14:28.249Z","edit_password":"1642636df5a0f0935f8a3bc7e300591a"}, "114": {"id":"453812bc49319fd20d8101519601c9cb","rev":"1-7e1d3ac57eb04c89914c0856eee0d449","protocol":"https","url":"https://mwhateverhost.org:6984","node_name":"114","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"SECRET"},"port":"6984","created_on":"2020-12-10T18:49:59.820Z","edit_password":"453812bc49319fd20d8101519601c9cb"},"120":{"id":"home_node","rev":"13-6f792c0e4b4a91d611c5da8330c61add","protocol":"https","url":"https://whateverhost.org:6984","node_name":"120","username":"admin","host":"whateverhost.org","attributes":{"company":"keyw","office_type":"regional","classification":"TOP SECRET"},"port":"6984","updated_on":"2019-08-02T18:20:54.346Z","edit_password":"home_node"}}}

    return store.dispatch(rulesActions.pushRules(myPostDataRules, myPostDataScript))
      .then(() => {
        expect(store.getActions()[0].type).toEqual('PUSH_RULES_ATTEMPT');
        expect(store.getActions()[1].type).toEqual('OPEN_DIALOG');
        expect(store.getActions()[1].title).toEqual('Success!');
        expect(store.getActions()[1].message).toEqual('Rules updated successfully.');
        expect(store.getActions()[2].type).toEqual('PUSH_RULES_SUCCESS');

      });
  })

})
