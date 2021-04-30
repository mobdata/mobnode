import crypto from 'crypto'
import dotenv from 'dotenv-safe'

import { key, ca, cert } from './ssl'

try {
  dotenv.config()
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Ensure the CouchDB related environment variables are set in .env')
  process.exit(1)
}

const couchHost = process.env.COUCH_HOST || 'localhost'
const couchPort = process.env.COUCH_PORT || 6984
const couchUser = process.env.COUCH_USER
const couchUrl = process.env.COUCH_URL || `https://${couchHost}:${couchPort}`

const authToken = crypto
  .createHmac('sha1', process.env.COUCH_AUTH_SECRET)
  .update(couchUser)
  .digest('hex')

const couchHeaders = {
  'Content-Type': 'application/json',
  'X-Auth-CouchDB-Roles': '_admin',
  'X-Auth-CouchDB-UserName': couchUser,
  'X-Auth-CouchDB-Token': authToken,
}

const couchConfig = {
  url: couchUrl,
  requestDefaults: {
    key,
    ca,
    cert,
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
  headers: couchHeaders,
  user: couchUser,
  authToken,
}

export default couchConfig
export {
  couchHost, couchPort, couchUser, couchHeaders, couchUrl,
}
