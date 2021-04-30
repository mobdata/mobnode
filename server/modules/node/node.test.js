import test from 'ava'
import rewiremock from 'rewiremock'
import { ExpressRes, expressNext } from '../../mock/middlewareParams'
import setupCouchMock from '../../mock/setupCouchMock'

const nodeControllerPathFromMockDirectory = '../modules/node/node.controller'

test.beforeEach(() => {
  rewiremock.enable()
})

test.afterEach(() => {
  rewiremock.disable()
})

test('Check that nodes are formatted correctly', async (t) => {
  const { couchMock, mock } = setupCouchMock(nodeControllerPathFromMockDirectory)
  const res = await mock.getNodes(null, new ExpressRes(), expressNext)
  t.is(res.statusCode, 200)
  t.is(Array.isArray(res.body.rows), true)
  // eslint-disable-next-line
  const idIsNotUndefined = (currentX) => typeof currentX.id !== 'undefined';
  const revIsNotUndefined = (currentX) => typeof currentX.rev !== 'undefined';
  // eslint-disable-next-line
  const _idIsUndefined = (currentX) => typeof currentX._id === 'undefined';
  // eslint-disable-next-line
  const _revIsUndefined = (currentX) => typeof currentX._rev === 'undefined';
  t.is(res.body.rows.every(idIsNotUndefined), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every(revIsNotUndefined), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every(_idIsUndefined), true)
  // eslint-disable-next-line
  t.is(res.body.rows.every(_revIsUndefined), true)
  t.is(res.body.rows.some((x) => x.id === '_design/md_nodes'), true)
  t.is(couchMock.callStack.pop(), couchMock.call.GET_NODES_PSWDLESS)
})
