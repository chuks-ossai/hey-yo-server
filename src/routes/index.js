const express = require('express');
const routes = express();
const authRouter = require('./auth');

routes.use('/auth', authRouter);

module.exports = routes;