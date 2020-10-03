const express = require('express');
const router = express.Router();

const ChatController = require('../controllers/chat');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.put('/message/send/:receiverId', AsyncErrorHandler(ChatController.sendMessage));
router.get('/messages/get/:receiverId', AsyncErrorHandler(ChatController.getMessages));

module.exports = router;