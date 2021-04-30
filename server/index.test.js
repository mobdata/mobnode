import test from 'ava'
import request from 'supertest'
import server from './index'

test('Should return 404 Not Found for undefined endpoints', async (t) => {
  t.plan(1)

  const res = await request(server)
    .get('/api')

  t.is(res.statusCode, 404)
})

test('Should reject unsupported media types for POST, PUT, and DELETE', async (t) => {
  t.plan(3)

  const route = '/api/not/a/real/route'

  let res = await request(server)
    .post(route)

  t.is(res.statusCode, 415)

  res = await request(server)
    .put(route)

  t.is(res.statusCode, 415)

  res = await request(server)
    .delete(route)

  t.is(res.statusCode, 415)
})
