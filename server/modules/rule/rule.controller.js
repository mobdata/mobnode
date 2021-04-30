/* eslint-disable no-underscore-dangle */
import https from 'https'
import fetch from 'node-fetch'
import { parse } from '@mobdata/mobdsl'
import {
  getDbs,
  putNewDbs,
  makeDesignDocs,
  putDesignDocs,
  makeRepDocs,
  postRepDocs,
} from './controller/pushRules'
import {
  key, cert, ca,
  couchUrl, couchHeaders,
} from '../../config'

const agent = new https.Agent({
  key,
  cert,
  ca,
})

const defaultOpts = {
  headers: couchHeaders,
  agent,
}

const defaultOptsWithUrl = {
  url: couchUrl,
  headers: couchHeaders,
  agent,
}

export const getScript = async (req, res, next) => fetch(`${couchUrl}/md_rules/default?revs_info=true`, defaultOpts)
  .then((response) => response.json())
  .then((body) => {
    // Fire off individual get requests for now
    // TODO: Investigate http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs
    // This only works for keys, but if it could work for revision IDs,
    // this would be the best approach
    const { _revs_info: revsInfo } = body
    const promises = revsInfo
      .filter(({ status }) => status === 'available')
      .map(({ rev: revId }) => fetch(`${couchUrl}/md_rules/default?rev=${revId}`, defaultOpts))
    promises.unshift(body)
    return Promise.all(promises)
  })
  .then((results) => {
    const body = results.shift()
    const promises = results.map((result) => result.json())
    promises.unshift(body)
    return Promise.all(promises)
  })
  .then((results) => {
    const body = results.shift()
    const { _id: id, _rev: rev } = body
    return res.status(200).json({
      ...body,
      _id: undefined,
      _rev: undefined,
      _revs_info: undefined,
      id,
      rev,
      revisions: results.map(({ _rev, script, message }) => ({ rev: _rev, script, message })),
    })
  })
  .catch(next)

export const updateScript = async (req, res, next) => {
  const { script, message } = req.body
  const formattedBody = {
    _rev: req.body.rev,
    script,
    message,
  }

  return fetch(`${couchUrl}/md_rules/default`, {
    method: 'PUT',
    body: JSON.stringify(formattedBody),
    headers: couchHeaders,
    agent,
  })
    .then((response) => Promise.all([response, response.json()]))
    .then((results) => {
      const { status } = results[0]
      const { id, rev } = results[1]

      if (status === 201) {
        res.status(201).json({
          id,
          rev,
          script,
          message,
        })
      } else {
        res.status(status).json({
          ok: false,
          message: 'Unable to update script',
        })
      }
      return res
    })
    .catch(next)
}

export const getNodes = async (req, res, next) => fetch(`${couchUrl}/md_nodes/_all_docs?include_docs=true`, defaultOpts)
  .then((response) => response.json())
  .then((body) => body.rows)
  .then((rows) => {
    const n = rows
    // Extract node docs and remove the design document
      .map(({ doc }) => doc)
      .filter(({ _id }) => _id !== '_design/md_nodes')
    // Properly format the nodes into a single object with the node name as the key
      .reduce((acc, cur) => ({ ...acc, [cur.node_name]: cur }), {})
    Object.keys(n).forEach((nodeName) => {
      const node = n[nodeName]
      node.url = `${node.protocol}://${node.username}:${node.password}@${node.host}:${node.port}`
    })
    req.nodes = n
    return next()
  })
  .catch(next)

export const getMdHome = async (req, res, next) => fetch(`${couchUrl}/md_home/_all_docs?include_docs=true`, defaultOpts)
  .then((body) => body.json())
  .then((body) => {
    const mdHome = body.rows[0].doc.node_name
    req.sourceNodeName = mdHome
    return next()
  })
  .catch(next)

export const validateScript = async (req, res, next) => {
  const { nodes, script } = req.body
  const mdHome = req.sourceNodeName
  const error = 'The defined rules are not valid with the nodes that are available.'
  try {
    req.rules = parse(script, { _source_node_name: mdHome, nodes })
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: error,
    })
  }
  return next()
}

export const getRules = async (req, res, next) => fetch(`${couchUrl}/_replicator/_all_docs?include_docs=true`, defaultOpts)
  .then((response) => Promise.all([response, response.json()]))
  .then((results) => {
    const { status } = results[0]
    const body = results[1]
    const { total_rows: count } = body
    const rows = body.rows
      .filter((row) => row.id !== '_design/_replicator')
      .map(({ doc }) => {
        const {
          _id: id,
          _rev: rev,
          _replication_state: replicationState,
          _replication_state_time: replicationStateTime,
          _replication_state_reason: replicationStateReason,
          _replication_id: replicationId,
        } = doc

        return {
          id,
          rev,
          replicationState,
          replicationStateTime,
          replicationStateReason,
          replicationId,
          ...doc,
          _id: undefined,
          _rev: undefined,
          _replication_state: undefined,
          _replication_state_time: undefined,
          _replication_state_reason: undefined,
          _replication_id: undefined,
        }
      })
    if (status === 200) {
      return res.status(200).json({
        count,
        rows,
      })
    }
    return res.status(status).json({
      ok: false,
      message: 'failure to retrieve rules.',
    })
  })
  .catch(next)

export const deleteRules = async (req, res, next) => {
  const { rules } = req.body

  return fetch(`${couchUrl}/_replicator/_all_docs?include_docs=true`, defaultOpts)
    .then((response) => response.json())
    .then((body) => body.rows)
    .then((rows) => {
      const curRepDocs = rows
        .map(({ doc }) => doc)
        .map(({ _id, _rev, hash }) => ({ id: _id, rev: _rev, hash }))

      // const newHashes = rules.map(({ hash }) => hash)
      // Delete all of the rep docs not included in the new rules
      const rulesToDelete = curRepDocs
        // .filter(({ hash }) => !newHashes.includes(hash))
        .map(({ id, rev }) => ({ _id: id, _rev: rev, _deleted: true }))

      return Promise.all([curRepDocs,
        fetch(`${couchUrl}/_replicator/_bulk_docs`, {
          method: 'POST',
          headers: couchHeaders,
          agent,
          body: JSON.stringify({ docs: rulesToDelete }),
        })])
    })
    .then((results) => {
      const curRepDocs = results.shift()
      const response = results.shift()
      return Promise.all([curRepDocs, response, response.json()])
    })
    .then((results) => {
      const curRepDocs = results.shift()
      const response = results.shift()
      const body = results.shift()

      // Reduce the existing rules into a unique set
      const curHashes = Array.from(
        new Set(curRepDocs
          .filter(({ hash }) => typeof hash !== 'undefined')
          .map(({ hash }) => hash)),
      )
      /* let rulesToPush = []
      if (rules !== []) {
        rulesToPush = rules.filter(({ hash }) => !curHashes.includes(hash))
      }
      req.body.rules = rulesToPush */
      req.body = {
        rules,
        curHashes,
      }
      if (response.status !== 200 && response.status !== 201) {
        res.status(response.status).json(body)
      }
      return next()
    })
    .catch(next)
}

export const pushRules = async (req, res, next) => {
  try {
    const { rules } = req.body
    // console.log(`Rules being pushed: ${JSON.stringify(rules)}`);
    const nodes = { nodes: [] }
    const nodesRes = await getNodes(nodes, null, () => Object.values(nodes.nodes))

    const rulesPasswords = rules.map((rule) => {
      const { source, target } = rule
      const sourceUrl = nodesRes.find((node) => node.node_name === source).url
      const targetUrl = nodesRes.find((node) => node.node_name === target).url

      return {
        ...rule,
        sourceUrl,
        targetUrl,
      }
    })

    const dbs = await getDbs(defaultOptsWithUrl)

    await putNewDbs(rulesPasswords, dbs, defaultOptsWithUrl)

    const designDocs = makeDesignDocs(rulesPasswords)

    await putDesignDocs(designDocs, defaultOptsWithUrl)

    const repDocs = makeRepDocs(rulesPasswords)

    const postRepDocsResult = await postRepDocs(repDocs, defaultOptsWithUrl)

    // should just return postRepDocsResult in response-json, for now it's more stuff to look at
    return res.status(200).json(postRepDocsResult)
  } catch (err) {
    return next(err)
  }
}
