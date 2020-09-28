const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.get('/my/posts', AsyncErrorHandler(UserController.getMyDetails));

module.exports = router;