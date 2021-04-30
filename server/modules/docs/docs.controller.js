import https from 'https';
import fetch from 'node-fetch';
import {
  cert, key, ca, couchPort, couchHeaders,
} from '../../config';

// cert info for our requests
const agent = new https.Agent({
  key,
  cert,
  ca,
})

export const pokeHost = async (req, res, next) => {
  const { host } = req.params;
  fetch(`https://${host}:${couchPort}/#utils`, {
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((info) => res.status(200).json({ info }))
    .catch(next)
}

/* Builds and issues a POST request to the given host
   containing the given doc.  Calls the addupdatedoc update function in the
   design document of the given database, which will add the hostname to the document. */
export const createDocWithUpdateFn = async (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    node_name, host, db, doc, id
  } = req.body;
  // eslint-disable-next-line
  const docID = id
  fetch(`https://${host}:${couchPort}/${db}/_design/${db}/_update/addupdatedoc/${docID}`, {
    method: 'POST',
    body: JSON.stringify({ ...doc, node_name }),
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((newDoc) => {
      if (newDoc.status && newDoc.status === 'ok') {
        res.status(201).json({ newDoc })
      } else if (newDoc.error && newDoc.error === 'not_found' && newDoc.reason === 'missing') {
        res.status(400).json({ newDoc })
      } else if (newDoc.error && newDoc.error === 'compilation_error') {
        res.status(401).json({ newDoc })
      } else { res.status(500).json({ newDoc }) }
    })
    .catch(next)
}

export const getDocs = async (req, res, next) => {
  const { host, db } = req.params;
  console.log("GET DOCS")
  fetch(`https://${host}:${couchPort}/${db}/_all_docs`, {
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((docs) => res.status(200).json({ docs }))
    .catch(next)
}

export const getDoc = async (req, res, next) => {
  const { host, db, doc } = req.params
  fetch(`https://${host}:${couchPort}/${db}/${doc}`, {
    method: 'GET',
    agent,
    headers: couchHeaders,
  })
    .then((body) => body.json())
    .then((docFields) => res.status(200).json({ docFields }))
    .catch(next)
}
