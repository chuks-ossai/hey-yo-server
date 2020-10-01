const User = require('../models/user');

const validateUserEmailExist = async (email) => {
    try {
        const user = await User.findOne({ email })

        return !!user

    } catch (err) {
        throw new Error(err.message);
    }
};

const validateUsernameExist = async (username) => {
    try {
        const user = await User.findOne({ username })

        return !!user

    } catch (err) {
        throw new Error(err.message);
    }
};

const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username });
            if (!user) {
                return {error: 'Unable to find user. please register'}
            }
        const userObj = await user.toObject();
        return await userObj
    } catch (err) {
        throw new Error(err.message);
    }
}

const createNewUser = async (userInput) => {
    try {
        return await User.create(userInput);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = { validateUserEmailExist, validateUsernameExist, createNewUser, getUserByUsername };