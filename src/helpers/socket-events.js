const formatMessage = require('../utils/format-message');
const { addUser, getCurrentUser, getLeavingUser, getAllUsersInRoom } = require('../utils/user');

module.exports = (io) => {
    const chatBotName = 'Hey Yo!';

    io.on('connection', socket => {

        socket.on('refreshData', () => {
            console.log('data shoul refresh here');
            io.emit('pageRefresh', {});
        })

        socket.on('joinChat', (data) => {
            console.log(data);
            socket.join(data.sender);
            socket.join(data.receiver);
        })

        socket.on('typing', (data) => {
            io.to(data.receiver).emit('senderTyping', data)
        })

        socket.on('stopTyping', (data) => {
            io.to(data.receiver).emit('senderStoppedTyping', data)
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