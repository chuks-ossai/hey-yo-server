const express = require('express');
const routes = express();
const authRouter = require('./auth');
const postRouter = require('./post');
const userRouter = require('./user');
const chatRouter = require('./chat');
const passport = require('../config/passport');

routes.use('/auth', authRouter);
routes.use('/posts', passport.authenticate('jwt', { session: false }), postRouter);
routes.use('/users', passport.authenticate('jwt', { session: false }), userRouter);
routes.use('/chats', passport.authenticate('jwt', { session: false }), chatRouter);

module.exports = routes;