import { Router } from 'express'
import * as ClientErrorController from './clientError.controller'

const router = new Router()

router.route('/clientError')
  .post(ClientErrorController.logError)

export default router
