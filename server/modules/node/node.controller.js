/* eslint-disable no-underscore-dangle */
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

/*
  Gets all the nodes, excluding their passwords.
*/
export const getNodes = async (req, res, next) => {
  const opts = {
    headers: couchHeaders,
    agent,
  }
  // /md_nodes/_all_docs?include_docs=true
  return fetch(`${couchUrl}/md_nodes/_design/md_nodes/_view/passwordless`, opts)
    .then((body) => body.json())
    .then((json) => {
      const { rows } = json
      return rows
        .map((node) => ({
          id: node.id,
          ...node.value,
          _id: undefined,
          _rev: undefined,
        }))
    })
    .then((nodes) => res.status(200).json({ count: nodes.length, rows: nodes }))
    .catch(next)
}

export const createNode = async (req, res, next) => {
  const {
    node_name,
    protocol,
    host,
    port,
    username,
    password,
    url,
    attributes,
  } = req.body

  const node = {
    node_name,
    protocol,
    host,
    port,
    username,
    password,
    url,
    attributes,
    created_on: new Date(),
  }

  fetch(`${couchUrl}/md_nodes`, {
    method: 'POST',
    body: JSON.stringify(node),
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((nodes) => res.status(201).json({ ...nodes, ok: undefined, ...node }))
    .catch(next)
}

/*
  Updates a single node by manually replacing its fields with new values. Does not update password.
*/
export const updateNode = async (req, res, next) => {
  let { node } = req.body
  node = {
    _id: node.id, _rev: node.rev, ...node, id: undefined, rev: undefined, updated_on: new Date(),
  }
  try {
    fetch(`${couchUrl}/md_nodes/_design/md_nodes/_update/update/${req.nodeId}`, {
      method: 'POST',
      agent,
      body: JSON.stringify(node),
      headers: couchHeaders,
    }).then((response) => response.json())
      .then(() => {
        node = {
          id: node._id, rev: node._rev, ...node, _id: undefined, _rev: undefined,
        }
        // var node = json.body
        // node = {id : node._id, rev : node._rev, ...node, _id: undefined, _rev: undefined}
        return res.status(200).json(node)
      })
      // .catch(err => console.log(`INTERIOR ERROR: ${err}`))
      .catch(next)
  } catch (err) {
    // console.log(`UPDATE TRY ERROR: ${err}`)
  }
}

/*
  Updates nodes by overriding their copies in the database.
*/
export const bulkUpdateNodes = async (req, res, next) => {
  let nodes = []
  if (typeof req.body.nodes !== 'undefined') {
    nodes = req.body.nodes.map((node) => ({
      ...node,
      _id: node.id,
      _rev: node.rev,
      id: undefined,
      rev: undefined,
      updated_on: new Date(),
    }))
  }

  try {
    const response = await fetch(`${couchUrl}/md_nodes/_bulk_docs`, {
      method: 'POST',
      agent,
      body: JSON.stringify({
        docs: nodes,
      }),
      headers: couchHeaders,
    })

    if (response.status === 201) {
      const body = await response.json()
      res.status(200).json({
        rows: body
          .filter((row) => row.ok)
          .map((row) => ({ ...nodes[0], id: row.id, rev: row.rev })),
      })
    } else {
      res.status(400).json({
        ok: false,
      })
    }
  } catch (err) {
    next(err)
  }
}

export const validateDeleteNodes = async (req, res, next) => {
  const { nodes } = req.body
  const valid = nodes.every((node) => Object.prototype.hasOwnProperty.call(node, 'id')
    && Object.prototype.hasOwnProperty.call(node, 'rev'))

  if (!valid) {
    return res.status(400).json({
      ok: false,
      message: 'Must include an ID and a Revision ID',
    })
  }

  return next()
}

export const deleteNodes = async (req, res, next) => {
  const nodes = req.body.nodes
    .map((node) => ({ _id: node.id, _rev: node.rev, _deleted: true }))

  fetch(`${couchUrl}/md_nodes/_bulk_docs`, {
    method: 'POST',
    agent,
    body: JSON.stringify({
      docs: nodes,
    }),
    headers: couchHeaders,
  })
    .then((response) => response.json())
    .then((body) => res.status(200).json({ rows: body }))
    .catch(next)
}

export const deleteNode = async (req, res, next) => {
  fetch(`${couchUrl}/md_nodes/${req.nodeId}?rev=${req.query.rev}`, {
    method: 'DELETE',
    agent,
    headers: couchHeaders,
  })
    .then((response) => Promise.all(response.status, response.json()))
    .then((results) => {
      const status = results.shift()
      const body = results.shift()
      if (status === 200) {
        return res.status(200).json({
          ok: true,
        })
      }
      return res.status(status).json(body)
    })
    .catch(next)
}

/*
  Checks to see if the user correctly entered the node's password.
*/
export const checkPassword = async (req, res, next) => {
  const opts = {
    headers: couchHeaders,
    agent,
  }

  fetch(`${couchUrl}/md_nodes/_design/md_nodes/_view/password?key=["${req.nodeId}","${req.password}"]`, opts)
    .then((response) => response.json())
    .then((json) => res.status(200).json(json.rows[0]))
    /* .catch((error) => {
      console.log(`ERROR CONTROLLER: ${error}`)
    }) */
    .catch(next)
}

/*
Attempts to update a node's password, but first verifies that the user knows the current password.
*/
export const updatePassword = async (req, res, next) => fetch(`${couchUrl}/md_nodes/_design/md_nodes/_update/password/${req.nodeId}`, {
  headers: couchHeaders,
  method: 'POST',
  agent,
  body: JSON.stringify({ current: req.password, new: req.newPassword }),
})
  .then((response) => response.json())
  .then((json) => res.status(200).json(json))
  .catch(next)

/*
 Gets a single node, INCLUDING the password.
*/
export const getOneNode = async (req, res, next) => {
  const opts = {
    headers: couchHeaders,
    agent,
  }
  return fetch(`${couchUrl}/md_nodes/${req.nodeId}`, opts)
    .then((body) => body.json())
    .then((json) => res.status(200).json({ json }))
    .catch(next)
}

export const updateOneNode = async (req, res, next) => {
  const {
    node_name,
    protocol,
    host,
    port,
    username,
    password,
    attributes,
  } = req.body

  const node = {
    node_name,
    protocol,
    host,
    port,
    username,
    password,
    attributes,
    updated_on: new Date(),
  }

  fetch(`${couchUrl}/md_nodes/${req.nodeId}?rev=${req.body.rev}`, {
    method: 'PUT',
    agent,
    headers: couchHeaders,
    body: JSON.stringify(node),
  })
    .then((response) => Promise.all(response.status, response.json()))
    .then((results) => {
      const status = results.shift()
      const body = results.shift()
      if (status !== 200) {
        return res.status(status).json(body)
      }
      return res.status(200).json(body)
    })
    .catch(next)
}

export const handleErrors = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() })
  }

  return next()
}

export const postGarbageFile = async (req, res, next) => {
  fetch(`${couchUrl}/garbage_dump`, {
    method: 'POST',
    body: JSON.stringify(req.body),
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((nodes) => res.status(201).json({ ...nodes, ok: undefined, ...req.body }))
    .catch(next)
}

/* eslint-enable camelcase */
