const express = require('express');
const routes = express();
const authRouter = require('./auth');
const postRouter = require('./post');

routes.use('/auth', authRouter);
routes.use('/post', postRouter);

module.exports = routes;