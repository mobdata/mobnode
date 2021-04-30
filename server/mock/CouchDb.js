import mockRepDocs from './repDocs'
import mockScript from './getScript'
import pastScripts from './pastScripts'
import mockNodes from './nodes'

function HttpResponse(body, code) {
  this.body = body
  this.status = code
  this.ok = true
  this.json = () => this.body
}

function CouchDbMock() {
  this.call = {
    GET_DBS: 'GET_DBS',
    PUT_DBS: 'PUT_DBS',
    GET_REPLICATION: 'GET_REPLICATION',
    GET_DESIGN: 'GET_DESIGN',
    PUT_DESIGN: 'PUT_DESIGN',
    POST_DOCS: 'POST_DOCS',
    GET_NODES: 'GET_NODES',
    GET_NODES_PSWDLESS: 'GET_NODES_PSWDLESS',
    PUT_RULES: 'PUT_RULES',
    GET_HOME: 'GET_HOME',
  }
  this.callStack = []

  const verifyParameters = (opts) => {
    const agentNotDefined = typeof opts.agent === 'undefined'
    const headersNotDefined = typeof opts.headers === 'undefined'
    if (agentNotDefined || headersNotDefined) {
      throw new Error('Parameters are malformed; check agent and headers.')
    }
  }

  this.resetStack = () => {
    this.callStack = []
  }

  this.handleRequest = (url, opts) => {
    let res = null
    verifyParameters(opts)
    if (typeof opts.method === 'undefined' || opts.method === 'GET') {
      if (url.match(/.*_all_dbs/)) {
        res = new HttpResponse([], 200)
        this.callStack.push(this.call.GET_DBS)
      } else if (url.match(/.*_replicator\/_all_docs\?include_docs=true/)) {
        res = new HttpResponse(mockRepDocs, 200)
        this.callStack.push(this.call.GET_REPLICATION)
      } else if (url.match(/.*_replicator\/[a-z0-9]+/)) {
        const repId = url.split('/_replicator/')[1]
        const filteredDocs = mockRepDocs.rows.filter((x) => x.id === repId)
        res = new HttpResponse(filteredDocs, 200)
        this.callStack.push(this.call.GET_REPLICATION)
      } else if (url.match(/.*md_nodes\/_all_docs\?include_docs=true/)) {
        res = new HttpResponse(mockNodes, 200)
        this.callStack.push(this.call.GET_NODES)
      } else if (url.match(/.*md_nodes\/_design\/md_nodes\/_view\/passwordless/)) {
        res = new HttpResponse(mockNodes, 200)
        this.callStack.push(this.call.GET_NODES_PSWDLESS)
      } else if (url.match(/.*md_rules\/default\?revs_info=true/)) {
        res = new HttpResponse(mockScript, 200)
      } else if (url.match(/.*md_rules\/default\?rev=.*/)) {
        const revId = url.split('=')[1]
        // eslint-disable-next-line
        const pastScript = pastScripts.filter((x) => x._rev === revId)[0]
        res = new HttpResponse(pastScript)
      } else if (url.match(/.*_design.*/)) {
        res = new HttpResponse({ ok: true, _id: 'test', _rev: 'test' }, 200)
        this.callStack.push(this.call.GET_DESIGN)
      } else if (url.match(/.*md_home*./)) {
        res = new HttpResponse({ ok: true, rows: [{ doc: { node_name: '000' } }] })
        this.callStack.push(this.call.GET_HOME)
      } else {
        throw new Error(`No matching route in CouchDb mock function. ${url}`)
      }
    } else if (opts.method === 'POST') {
      if (url.match(/.*_replicator\/_bulk_docs/)) {
        res = new HttpResponse({ ok: true }, 200)
        this.callStack.push(this.call.POST_DOCS)
      } else {
        throw new Error(`No matching route in CouchDb mock function. ${url}`)
      }
    } else if (opts.method === 'PUT') {
      if (url.match(/.*_design.*/)) {
        res = new HttpResponse({ ok: true }, 200)
        this.callStack.push(this.call.PUT_DESIGN)
      } else if (url.match(/.*md_rules\/default/)) {
        res = new HttpResponse({ id: 'test_id', rev: 'test_rev' }, 201)
        this.callStack.push(this.call.PUT_RULES)
      } else {
        res = new HttpResponse({ ok: true })
        this.callStack.push(this.call.PUT_DBS)
      }
    } else if (opts.method === 'DELETE') {
      throw new Error('Mock delete method not yet implemented')
    } else {
      throw new Error(`No matching method in CouchDb mock function. ${url}`)
    }
    return new Promise((resolve) => resolve(res))
  }
}

export default CouchDbMock
