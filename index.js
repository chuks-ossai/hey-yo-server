const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/format-message');
const { addUser, getCurrentUser, getLeavingUser } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3002;
const publicDir = path.join(__dirname, 'public');
const chatBotName = 'Hey Yo!'

app.use(express.static(publicDir))

app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
      const user = addUser(socket.id, username, room);
      socket.join(user.room);
      socket.emit('connected', formatMessage(chatBotName, 'Welcome to chat', true, user.room, socket.id));
      socket.broadcast.to(user.room).emit('joined', formatMessage(chatBotName, `${user.username} has joined room`, true));
    })
    
    socket.on('newMessage', message => {
        const user = getCurrentUser(socket.id);
      if (user) {
        io.to(user.room).emit('serverMessage', formatMessage(user.username, message, false, null, user.id));
      } else {
        console.log('Sorry we cannot find this user');
      }
    })

    socket.on('disconnect', message => {
        const user = getLeavingUser(socket.id);
        if (user) {
            io.to(user.room).emit('left', formatMessage(chatBotName, `${user.username} has left the room`, true));            
        }
    })

    
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

