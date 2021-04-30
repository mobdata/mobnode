import test from 'ava'
// eslint-disable-next-line
import regeneratorRuntime from 'regenerator-runtime'

import { ExpressRes } from '../../mock/middlewareParams'
import { logError } from './clientError.controller'


test('Ensure that the log error endpoint is working', async (t) => {
  const req = {
    body: {
      meta: 'This is a test of the error logging function',
      text: 'It appears to work...',
      stack: ' ...unless ava throws an error below 🤔',
    },
  }
  const res = await logError(req, new ExpressRes())
  t.is(res.statusCode, 200)
})
