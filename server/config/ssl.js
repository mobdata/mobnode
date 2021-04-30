import { readFileSync } from 'fs'
import dotenv from 'dotenv-safe'

try {
  dotenv.load()
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Must specify the SSL file paths in the .env file')
  process.exit(1)
}

const key = readFileSync(process.env.SSL_KEY_PATH)
const cert = readFileSync(process.env.SSL_CERT_PATH)
const ca = readFileSync(process.env.SSL_CA_PATH)

const ssl = {
  key,
  cert,
  ca,
  rejectUnauthorized: process.env.NODE_ENV === 'production',
}

export { key, ca, cert }
export default ssl
