import { Router } from 'express'
import { body } from 'express-validator'
import * as ConditionController from './condition.controller'

const router = new Router()

router.route('/md_config')
  .get(ConditionController.getWholeDocument)

router.route('/conditions')
  .get(ConditionController.getConditions)
  .put(
    body('rev', 'Must provide a revision ID.').exists(),
    ConditionController.handleErrors,
    ConditionController.updateConditions,
  )

router.param('conditionId', (req, res, next, id) => {
  req.conditionId = id
  next()
})

export default router
