import fetch from 'node-fetch'
import { readFileSync } from 'fs'

// read in classyjs from the classy node_module so that it always has the current code.
const classyjs = readFileSync('node_modules/@mobdata/classy/index.js', 'utf8');
// read in addupdatedoc, clean up spacing (since raw text file is being read in)
const addupdatedoc = readFileSync('etc/addupdatedoc.txt', 'utf8').replace(/\r?\n|\r|\t/g, '').replace(/\s+/g, ' ')

export const getDbs = (opts) => fetch(`${opts.url}/_all_dbs`, opts)
  .then((body) => body.json())

export const generateNewDbUpdateFunction = (currentNode) => `function(doc, req) { function errorObject(code, errorName, reason) { return [ null, { 'code': code, 'json': { 'error': errorName, 'reason': reason } } ]; } if (req.method !== 'POST') { return errorObject(400, 'Bad Request', 'Only POST is allowed here.'); } var newDoc = doc || { _id: null, updated_on: null, edited_by: null }; newDoc['_id'] = newDoc._id || req.uuid; newDoc['updated_on'] = new Date(); newDoc['edited_by'] = '${currentNode}'; return [newDoc, {'json': {'status': 'ok', '_id': newDoc['_id']}}]; }`

export const putNewDb = async (db, opts) => {
  const mdHome = await fetch(`${opts.url}/md_home/_all_docs?include_docs=true`, opts)
    .then((body) => body.json())
    .then((body) => body.rows[0].doc.node_name)
  await fetch(`${opts.url}/${db}`, {
    method: 'PUT', ...opts,
  })
  const updateFunctionString = generateNewDbUpdateFunction(mdHome)
  await fetch(`${opts.url}/${db}/_design/${db}`, {
    method: 'PUT',
    body: `{ "updates": { "insert-meta": "${updateFunctionString}" } }`,
    ...opts,
  })
}

export const putNewDbs = (rules, dbs, opts) => Promise.all(
  // Create an array of unique database names from the rules:
  Array.from(rules.reduce((acc, { db }) => acc.add(db), new Set()))
    // Filter out databases that are already in the array returned from CouchDB:
    .filter((db) => !dbs.includes(db))
    // Convert to an array of promises to create the missing databases:
    .map((db) => putNewDb(db, opts)),
)

export const makeDesignDocs = (rules) => rules
  // Don't include rules that don't have a filter:
  .filter(({ filter }) => typeof filter !== 'undefined')
  // Aggregate the data about each rule into an intermediary array:
  .map(({ db, target, filter }) => ({
    db,
    target,
    name: filter.split(':')[0].trim(),
    funcStr: filter.substring(filter.indexOf(':') + 1).trim(),
  }))
  // Convert the array of rules data into an object with each unique db as
  // the keys and arrays of their associated filters as the values:
  .reduce((acc, { db, name, funcStr }) => ({
    ...acc,
    [db]: [
      ...(typeof acc[db] !== 'undefined' ? acc[db] : []),
      { name, funcStr },
    ],
  }), {})

export const putDesignDocs = (designDocs, opts) => Promise.all(
  // Break down the designDocs object into a nested array of format
  // [[key, value], [key, value]...]:
  Object.entries(designDocs)
    // Destructure the key and value pairs
    .map(async ([db, filters]) => {
      const existingDesignDoc = await fetch(`${opts.url}/${db}/_design/${db}`, {
        method: 'GET',
        ...opts,
      }).then((body) => body.json())
      // Transform the filters array into an object where name is the
      // key and funcStr is the value:
      const curfilters = filters.reduce((acc, { name, funcStr }) => ({
        ...acc,
        [name]: funcStr,
      }), {})
      // Setting up variables
      const keys = []
      const curadddoc = addupdatedoc
      const map = 'function(doc) {if (doc._conflicts) {emit(doc.last_updated, { winningRev: doc._rev, losingRevs: doc._conflicts } ) }}'
      // Loop through keys and add functions we need but leave the rest
      // eslint-disable-next-line
      for (const k in existingDesignDoc) {
        keys.push(k)
        switch (k) {
        case 'filters': {
          existingDesignDoc[k] = curfilters
          break; }
        case 'updates': {
          existingDesignDoc[k].addupdatedoc = curadddoc
          // update this whenever curadddoc is updated
          existingDesignDoc[k].version = '0.1'
          break; }
        case 'views': {
          // eslint-disable-next-line
            for (const v in existingDesignDoc[k]) {
            if (v === 'lib') {
              keys.push(v)
              existingDesignDoc[k][v].classyjs = classyjs
            }
            if (v === 'conflicts') {
              keys.push(v)
              existingDesignDoc[k][v].map = map
            }
          }
          break; }
        default: {
          break; }
        }
      }
      // If a key doesnt exist yet we add it here
      if (keys.indexOf('filters') === -1) {
        existingDesignDoc.filters = curfilters
      }
      if (keys.indexOf('updates') === -1) {
        existingDesignDoc.updates = { addupdatedoc: curadddoc }
      }
      if (keys.indexOf('views') === -1) {
        keys.push('lib')
        keys.push('conflicts')
        existingDesignDoc.views = {
          lib: { classyjs },
          conflicts: { map },
        }
      }
      if (keys.indexOf('lib') === -1) {
        existingDesignDoc.views.lib = { classyjs }
      }
      if (keys.indexOf('conflicts') === -1) {
        existingDesignDoc.views.conflicts = { map }
      }
      // We then push the edited design doc
      fetch(`${opts.url}/${db}/_design/${db}`, {
        method: 'PUT',
        ...opts,
        body: JSON.stringify(existingDesignDoc),
      })
        .then((body) => body.json())
    }),
)

// need to include password
export const makeRepDocs = (rules) => rules
  .map(
    ({
      targetUrl, db, hash, continuous, filter, sourceUrl,
    }) => ({
      create_target: true,
      continuous,
      hash,
      target: `${targetUrl}/${db}`,
      source: `${sourceUrl}/${db}`,
      ...(typeof filter !== 'undefined' && filter.length > 0 && filter.split(':').length > 1) && { filter: `${db}/${filter.split(':')[0].trim()}` },
    }),
    // console.log(rules),
  )

export const postRepDocs = (repDocs, opts) => fetch(`${opts.url}/_replicator/_bulk_docs`, {
  method: 'POST',
  body: JSON.stringify({
    docs: repDocs,
  }),
  ...opts,
})
  .then((body) => body.json())
