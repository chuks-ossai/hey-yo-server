const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3002;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir))

app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

io.on('connection', socket => {
    socket.emit('connected', 'User has connected to chat');

    socket.broadcast.emit('joined', 'User has joined the chat');

    socket.on('disconnect', () => {
        io.emit('left', 'User has left the chat');
    })
    
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

