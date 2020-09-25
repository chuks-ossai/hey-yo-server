const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('./config/passport');
const appConfig = require('./config/app')
const appErrorHandler = require('./helpers/app-error');
const socketEvents = require('./helpers/socket-events');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const publicDir = path.join(__dirname, 'public');

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  req.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Credentials', 'true');
  req.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
  req.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
})
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(publicDir))

// app.get('*', (req, res) => {
//     res.sendFile(path.join(publicDir, 'index.html'));
// });
app.use(passport.initialize());
app.use(passport.session());
socketEvents(io);
app.use('/api/v1', routes);
appErrorHandler(app);
mongoose
  .connect(`${appConfig.db.uri}:${appConfig.db.port}/${appConfig.db.name}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    server.listen(appConfig.port, () => console.log(`Server running on http://localhost:${appConfig.port}`));
    console.log('You are now connected to mongo')
  })
  .catch(err => console.err('something went wrong', err));

