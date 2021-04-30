import rewiremock from 'rewiremock'
// eslint-disable-next-line
import regeneratorRuntime from 'regenerator-runtime'  // required import for tests to pass

import CouchDbMock from './CouchDb'

const setupCouchMock = (controller) => {
  const couchMock = new CouchDbMock()
  const mock = rewiremock.proxy(controller, {
    'node-fetch': couchMock.handleRequest,
  })
  return { couchMock, mock }
}

export default setupCouchMock
