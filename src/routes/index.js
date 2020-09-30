const express = require('express');
const routes = express();
const authRouter = require('./auth');
const postRouter = require('./post');
const userRouter = require('./user');
const passport = require('../config/passport');

routes.use('/auth', authRouter);
routes.use('/posts', passport.authenticate('jwt', { session: false }), postRouter);
routes.use('/users', passport.authenticate('jwt', { session: false }), userRouter);

module.exports = routes;