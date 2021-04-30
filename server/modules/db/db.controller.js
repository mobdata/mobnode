import https from 'https'
import fetch from 'node-fetch'
import {
  key, cert, ca,
  couchUrl, couchHeaders, couchPort,
} from '../../config'

const agent = new https.Agent({
  key,
  cert,
  ca,
})

const opts = {
  agent,
  headers: couchHeaders,
}

export const getDbs = (req, res, next) => fetch(`${couchUrl}/_all_dbs`, opts)
  .then((body) => body.json())
  .then((dbs) => res.status(200).json({ dbs }))
  .catch(next)

export const getDbsFromTarget = (req, res, next) => {
  const { host } = req.params
  fetch(`https://${host}:${couchPort}/_all_dbs`, opts)
    .then((body) => body.json())
    .then((dbs) => res.status(200).json({ dbs }))
    .catch(next)
}

export const getHome = (req, res, next) => fetch(`${couchUrl}/md_home/_all_docs?include_docs=true`, opts)
  .then((body) => body.json())
  .then((docs) => docs.rows[0].doc.node_name)
  .then((name) => res.status(200).json({ name }))
  .catch(next)
