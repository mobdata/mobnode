import { Router } from 'express'
import { body, param, query } from 'express-validator'
import * as NodeController from './node.controller'

const router = new Router()

const requiredFields = [
  { field: 'node_name', message: 'A name for the node is required.' },
  { field: 'host', message: 'A hostname for the node is required.' },
  { field: 'port', message: 'An accessible port for the node is required.' },
  { field: 'username', message: 'A username is required.' },
  { field: 'password', message: 'A password is required.' },
]


router.route('/nodes/:nodeId-:password-:newPassword')
  .post(NodeController.updatePassword)
  .put(
    body('rev', 'Must provide a revision ID.').exists(),
  )
  .delete([
    param('nodeId')
      .exists()
      .isLength({ min: 32, max: 32 }),
    query('rev').exists()],
  NodeController.handleErrors,
  NodeController.deleteNode)

router.route('/nodes/update/:nodeId')
  .post(body().exists(), NodeController.updateNode)

router.route('/nodes')
  .get(NodeController.getNodes)
  .post(
    requiredFields.map(({ field, message }) => body(field, message).exists()),
    NodeController.handleErrors,
    NodeController.createNode,
  )
  .put(NodeController.validateDeleteNodes, NodeController.bulkUpdateNodes)
  .delete(NodeController.validateDeleteNodes, NodeController.deleteNodes)

router.route('/nodes/:nodeId')
  .get(NodeController.getOneNode)
  .put(
    body('rev', 'Must provide a revision ID.').exists(),
    NodeController.handleErrors,
    NodeController.updateOneNode,
  )
  .delete([
    param('nodeId')
      .exists()
      .isLength({ min: 32, max: 32 }),
    query('rev').exists()],
  NodeController.handleErrors,
  NodeController.deleteNode)

router.route('/nodes/garbage')
  .post(NodeController.postGarbageFile)

router.param('nodeId', (req, res, next, id) => {
  req.nodeId = id
  next()
})

router.param('password', (req, res, next, password) => {
  req.password = password
  next()
})

router.param('newPassword', (req, res, next, newPassword) => {
  req.newPassword = newPassword
  next()
})


export default router
