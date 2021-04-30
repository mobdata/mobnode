import 'core-js/stable';
import 'regenerator-runtime/runtime';
import https from 'https'

import Express from 'express'
import { resolve } from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'

import { ssl } from './config'
import { DbRouter } from './modules/db'
import { NodeRouter } from './modules/node'
import { ConditionRouter } from './modules/condition'
import { RuleRouter } from './modules/rule'
import { ClientErrorRouter } from './modules/clientError'
import { DocsRouter } from './modules/docs'

const app = new Express()

app.set('trust proxy', 'loopback')
app.use(helmet())

app.use(bodyParser.json())
app.use(cookieParser())
// Only use logs in development and production
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('[:date[clf]] HTTP/:http-version :method ":url" :status - :response-time ms'))
}

// Enforce proper content-type from requests
app.use('/api/*', (req, res, next) => {
  const contentType = req.headers['content-type']
  const method = req.method.toLowerCase()
  const isNotGet = method !== 'get'

  if (isNotGet && contentType !== 'application/json') {
    return res.status(415).json({
      ok: false,
      message: 'Must specify the content type "application/json" in the headers.',
    })
  }

  return next()
})

app.use('/api', DbRouter)
app.use('/api', NodeRouter)
app.use('/api', ConditionRouter)
app.use('/api', RuleRouter)
app.use('/api', ClientErrorRouter)
app.use('/api', DocsRouter)

if (process.env.NODE_ENV !== 'development') {
  app.use(Express.static(resolve(__dirname, '../..', 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html'))
  })
}

// Generic handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Resource not found.',
  })
})

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.statusCode === 404 ? 404 : 500).json({
    ok: false,
    message: err.message,
  })
})

const server = https.createServer(ssl, app)
server.listen(4444, (err) => {
  if (err) throw err

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Server ready on port 3001')
  }
})

export default server
