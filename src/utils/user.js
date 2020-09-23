const users = [];

const addUser = (id, username, room) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.username === room && user.room === room);

    if (existingUser) {
        console.log({error: 'Username already exist for the selected room'})
    }
    const user = { id, username, room };
    users.push(user);
    return user;
};

const getCurrentUser = id => users.find(user => user.id === id);

const getLeavingUser = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getAllUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

module.exports = { addUser, getCurrentUser, getLeavingUser, getAllUsersInRoom };