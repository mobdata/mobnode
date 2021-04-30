import { Router } from 'express'
import * as DbController from './db.controller'

const router = new Router()

router.route('/dbs')
  .get(DbController.getDbs)

router.route('/:host/dbs')
  .get(DbController.getDbsFromTarget)

router.route('/dbs/home')
  .get(DbController.getHome)

export default router
