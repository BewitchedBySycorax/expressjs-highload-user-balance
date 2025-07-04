const express = require('express');

const router = express.Router();

const { userController } = require('../controllers');

router.get('/:userId/balance', userController.getBalance);
router.patch('/:userId/balance', userController.updateBalance);

module.exports = router;
