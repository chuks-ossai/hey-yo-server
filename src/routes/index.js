const express = require('express');
const routes = express();
const authRouter = require('./auth');
const postRouter = require('./post');
const passport = require('../config/passport');

routes.use('/auth', authRouter);
routes.use('/post', passport.authenticate('jwt', { session: false }), postRouter);

module.exports = routes;