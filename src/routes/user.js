const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.get('/getAll', AsyncErrorHandler(UserController.getAll));
router.get('/my/details', AsyncErrorHandler(UserController.getMyDetails));
router.get('/user/:id', AsyncErrorHandler(UserController.getById));

module.exports = router;