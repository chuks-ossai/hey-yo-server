const users = [];

const addUser = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};

const getCurrentUser = id => {
    return cusers.find(user => user.id === id);
};

const getLeavingUser = id => {
    console.log('users', users);
    const index = users.findIndex(user => user.id === id);
    console.log('index', index)
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getAllUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = { addUser, getCurrentUser, getLeavingUser, getAllUsersInRoom };