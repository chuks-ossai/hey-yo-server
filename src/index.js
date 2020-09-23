const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan');
const helmet = require('helmet');

const { DB_URL = 'mongodb://localhost:27017', DB_NAME = 'hey-yo', PORT = 3002 } = process.env;
const appErrorHandler = require('./helpers/app-error');
const socketEvents = require('./helpers/socket-events');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const publicDir = path.join(__dirname, 'public');

app.use(helmet());
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(publicDir))

// app.get('*', (req, res) => {
//     res.sendFile(path.join(publicDir, 'index.html'));
// });

socketEvents(io);
app.use('/api/v1', routes);
appErrorHandler(app);
mongoose
  .connect(`${DB_URL}/${DB_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    console.log('You are now connected to mongo')
  })
  .catch(err => console.err('something went wrong', err));

