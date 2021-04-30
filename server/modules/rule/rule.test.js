import test from 'ava'
import rewiremock from 'rewiremock'

import { ExpressRes, expressNext } from '../../mock/middlewareParams'
import setupCouchMock from '../../mock/setupCouchMock'
import mockRules from '../../mock/rulesToPush'

const ruleControllerPathFromMockDirectory = '../modules/rule/rule.controller'

test.beforeEach(() => {
  rewiremock.enable()
})

test.afterEach(() => {
  rewiremock.disable()
})

test('Ensure that rules are formatted correctly', async (t) => {
  const { couchMock, mock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const res = await mock.getRules(null, new ExpressRes(), expressNext)
  t.is(res.statusCode, 200)
  t.is(Array.isArray(res.body.rows), true)
  t.is(res.body.rows.every((x) => typeof x.id !== 'undefined'), true)
  t.is(res.body.rows.every((x) => typeof x.rev !== 'undefined'), true)
  t.is(res.body.rows.every((x) => typeof x.replicationState !== 'undefined'), true)
  t.is(res.body.rows.every((x) => typeof x.replicationStateTime !== 'undefined'), true)
  t.is(res.body.rows.every((x) => x.replicationState === 'triggered'
    || typeof x.replicationStateReason !== 'undefined'), true)
  t.is(res.body.rows.every((x) => typeof x.replicationId !== 'undefined'), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every((x) => typeof x._id === 'undefined'), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every((x) => typeof x._rev === 'undefined'), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every((x) => typeof x._replication_state_time === 'undefined'), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every((x) => typeof x._replication_state_reason === 'undefined'), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every((x) => typeof x._replication_id === 'undefined'), true)
  t.is(couchMock.callStack.pop(), couchMock.call.GET_REPLICATION)
})

test('Ensure that push rules makes the appropriate requests', async (t) => {
  const { couchMock, mock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const req = mockRules
  const res = await mock.pushRules(req, new ExpressRes(), expressNext)
  t.is(res.statusCode, 200)
  const expected = ['GET_NODES', 'GET_DBS', 'GET_HOME', 'PUT_DBS', 'PUT_DESIGN', 'GET_DESIGN', 'PUT_DESIGN', 'POST_DOCS']
  const expectedMatch = (currentX, i) => currentX === expected[i];

  t.is(couchMock.callStack.every(expectedMatch), true)
})

test('Ensure that the delete rules endpoint calls next', async (t) => {
  const { mock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const req = mockRules
  const res = await mock.deleteRules(req, new ExpressRes(), expressNext)
  t.is(res.next, true)
})

test('Ensure that the get script endpoint is formatted correctly', async (t) => {
  const { mock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const res = await mock.getScript(null, new ExpressRes(), expressNext)
  t.is(res.statusCode, 200)
  t.is(res.body.rev, '87-10a0efee0fb4cd535c5d088a3edc1587')
  t.is(typeof res.body.script === 'string', true)
  t.is(res.body.revisions.length, 2)
})

test('Ensure that the update script endpoint is working', async (t) => {
  const { mock, couchMock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const req = { body: { message: 'Test commit', script: 'Test script' } }
  const res = await mock.updateScript(req, new ExpressRes(), expressNext)
  t.is(res.statusCode, 201)
  t.is(res.body.message, 'Test commit')
  t.is(res.body.script, 'Test script')
  t.is(res.body.id, 'test_id')
  t.is(res.body.rev, 'test_rev')
  t.is(couchMock.callStack.pop(), couchMock.call.PUT_RULES)
})

test('Ensure that the validate script endpoint is working', async (t) => {
  const { mock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const badReq = { body: { script: 'BAD SCRIPT', nodes: undefined } }
  const badRes = await mock.validateScript(badReq, new ExpressRes(), expressNext)
  t.is(badRes.statusCode, 400)
})

test('Ensure that the delete rules endpoint is working', async (t) => {
  const { mock, couchMock } = setupCouchMock(ruleControllerPathFromMockDirectory)
  const res = await mock.deleteRules(mockRules, new ExpressRes(), expressNext)
  t.is(res.next, true)
  t.is(couchMock.callStack.pop(), couchMock.call.POST_DOCS)
  t.is(couchMock.callStack.pop(), couchMock.call.GET_REPLICATION)
})
