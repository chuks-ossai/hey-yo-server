const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.get('/getAll', AsyncErrorHandler(UserController.getAll));
router.get('/my/details', AsyncErrorHandler(UserController.getMyDetails));
router.get('/user/:id', AsyncErrorHandler(UserController.getById));
router.put('/user/follow/:id', AsyncErrorHandler(UserController.follow));
router.put('/user/unfollow/:id', AsyncErrorHandler(UserController.unfollow));
router.put('/my/notification/mark/:notificationId', AsyncErrorHandler(UserController.markNotification));
router.put('/my/notification/delete/:notificationId', AsyncErrorHandler(UserController.deleteNotification));

module.exports = router;