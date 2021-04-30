import test from 'ava'
import rewiremock from 'rewiremock'
// eslint-disable-next-line
import regeneratorRuntime from 'regenerator-runtime'

import { ExpressRes, expressNext } from '../../mock/middlewareParams'
import CouchDbMock from '../../mock/CouchDb'

const couchMock = new CouchDbMock()

const mock = rewiremock.proxy('./db.controller', {
  'node-fetch': couchMock.handleRequest,
})

test.beforeEach(() => {
  rewiremock.enable()
})

test.afterEach(() => {
  rewiremock.disable()
})

test('Test middleware functions directly using fake res/next objects', async (t) => {
  const res = await mock.getDbs(null, new ExpressRes(), expressNext)
  t.is(res.statusCode, 200)
  t.is(Array.isArray(res.body.dbs), true)
  t.is(couchMock.callStack.pop(), couchMock.call.GET_DBS)
})

test('Negative test of the getDbs endpoint', async (t) => {
  const res = await mock.getDbs(null, null, expressNext)
  t.is(res.statusCode === 200, false)
})
