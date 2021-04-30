import { Router } from 'express'
import * as DocsController from './docs.controller'

// set up route aliases to our backend POST fetches
const router = new Router()
// route for 'pinging' a host (used in liveness checks)
router.route('/poke/:host')
  .get(DocsController.pokeHost)
// route for posting a doc, whether new or updated; expects doc in req body
router.route('/createdoc')
  .post(DocsController.createDocWithUpdateFn)
// route for GET-ing :doc from :db of :host
router.route('/:host/:db/docs/:doc')
  .get(DocsController.getDoc)
// route for GET-ing all docs from :db of :host
router.route('/:host/:db/docs')
  .get(DocsController.getDocs)

export default router
