import { Router } from 'express'
import * as RuleController from './rule.controller'

const router = new Router()

router.route('/rules')
  .get(RuleController.getRules)
  .post(
    RuleController.deleteRules,
    RuleController.pushRules,
  )

router.route('/rules/script')
  .get(RuleController.getScript)
  .post(
    RuleController.getNodes,
    RuleController.getMdHome,
    RuleController.validateScript,
    RuleController.updateScript,
  )

export default router
