const express = require('express')

const router = express.Router()

const { userController } = require('../controllers')

router.put('/users/:userId/balance', userController.updateBalance)
// TODO:
// router.put('/users/:userId/balance', userController.updateBalance.bind(userController))

module.exports = router
