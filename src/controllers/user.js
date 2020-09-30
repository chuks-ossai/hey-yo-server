const User = require('../models/user');

const UserController = {
    getAll: async (req, res, next) => {
        const users = await User.find({_id: {$ne: req.user._id}}).populate('posts');

        if (!users) {
            const error = new Error('Something went wrong while trying to get users');
            error.status = 200;
            return next(error);
        }

        const usersObj = users.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            return userObj
        })
        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: usersObj
        })
    },

    getMyDetails: async (req, res, next) => {
        const user = await User.findById(req.user._id).populate('post');

        if (!user) {
            const error = new Error('Something went wrong while trying to get user');
            error.status = 200;
            return next(error);
        }

        const userObj = user.toObject()
        delete userObj.password;

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [userObj]
        })
    },

    getById: async (req, res, next) => {
        const user = await User.findById(req.params.id).populate('post');

        if (!user) {
            const error = new Error('Something went wrong while trying to get user');
            error.status = 200;
            return next(error);
        }

        const userObj = user.toObject()
        delete userObj.password;

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [userObj]
        })
    },
}

module.exports = UserController;