const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');
const AsyncErrorHandler = require('../helpers/asyn-error-handler');

router.get('/getAll', AsyncErrorHandler(PostController.getAll));
router.get('/get-by-id/:id', AsyncErrorHandler(PostController.getById));
router.get('/get-by-user/:userId', AsyncErrorHandler(PostController.getByUser));
router.get('/my/getAll', AsyncErrorHandler(PostController.getAllMyPosts));
router.post('/new', AsyncErrorHandler(PostController.createNew));
router.put('/edit/:id', AsyncErrorHandler(PostController.editById));
router.delete('/delete-by-id/:id', AsyncErrorHandler(PostController.removeById));
router.delete('/delete-by-user/:userId/:id', AsyncErrorHandler(PostController.removeSingleUserPost));
router.delete('/deleteAll-user-posts/:userId', AsyncErrorHandler(PostController.removeAllUserPosts));

module.exports = router;