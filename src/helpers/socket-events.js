const formatMessage = require('../utils/format-message');
const { addUser, getCurrentUser, getLeavingUser, getAllUsersInRoom } = require('../utils/user');

module.exports = (io) => {
    const chatBotName = 'Hey Yo!';

    io.on('connection', socket => {

        socket.on('refreshData', () => {
            console.log('data shoul refresh here');
            io.emit('pageRefresh', {});
        })

        socket.on('joinRoom', ({ username, room }) => {
            const user = addUser(socket.id, username, room);
            socket.join(user.room);
            socket.emit('connected', formatMessage(chatBotName, `Welcome to ${user.room.charAt(0).toUpperCase() + user.room.slice(1)}`, true, user.room, socket.id));
            socket.broadcast.to(user.room).emit('joined', formatMessage(chatBotName, `${user.username} has joined room`, true));

            io.to(user.room).emit('roomData', { room: user.room, users: getAllUsersInRoom(user.room) })
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

                io.to(user.room).emit('roomData', { room: user.room, users: getAllUsersInRoom(user.room) })
            }
        })


    });
}