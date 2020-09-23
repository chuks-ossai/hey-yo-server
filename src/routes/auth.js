const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.post('/register', AsyncErrorHandler(AuthController.register));
router.post('/login', AsyncErrorHandler(AuthController.login));

module.exports = router;