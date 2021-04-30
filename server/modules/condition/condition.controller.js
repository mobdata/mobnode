import https from 'https'
import fetch from 'node-fetch'
import { validationResult } from 'express-validator'
import {
  key, cert, ca,
  couchUrl, couchHeaders,
} from '../../config'
/* eslint-disable camelcase */
const agent = new https.Agent({
  key,
  cert,
  ca,
})

export const getConditions = async (req, res, next) => {
  const opts = {
    headers: couchHeaders,
    agent,
  }

  return fetch(`${couchUrl}/md_config/conditions`, opts)
    .then((body) => body.json())
    .then((json) => {
      const rows = json.conditions
      return rows
        .map((condition, index) => ({
          id: index.toString(),
          on_status: condition.on_status,
          condition_text: condition.condition_text,
        }))
    })
    .then((conditions) => res.status(200).json({ count: conditions.length, rows: conditions }))
    .catch(next)
}

export const getWholeDocument = async (req, res, next) => {
  const opts = {
    headers: couchHeaders,
    agent,
  }

  return fetch(`${couchUrl}/md_config/_all_docs?include_docs=true`, opts)
    .then((body) => body.json())
    .then((json) => {
      const { rows } = json
      return rows
        .filter((row) => row.id !== '_design/md_config')
        .map((conditions) => ({
          id: conditions.id,
          rev: conditions.value.rev,
          ...conditions.doc,
          _id: undefined,
          _rev: undefined,
        }))
    })
    .then((conditions) => res.status(200).json({ count: conditions.length, rows: conditions }))
    .catch(next)
}

export const updateConditions = async (req, res, next) => {
  const {
    _id,
    _rev,
    conditions,
  } = req.body

  const condition = {
    _id,
    _rev,
    conditions,
  }
  fetch(`${couchUrl}/md_config/conditions?rev=${req.body.rev}`, {
    method: 'PUT',
    agent,
    headers: couchHeaders,
    body: JSON.stringify(condition),
  })
    .then((response) => response.json())
    .then((body) => res.status(200).json({ rows: body }))
    .catch(next)
}

export const handleErrors = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() })
  }
  return next()
}
/* eslint-enable camelcase */
