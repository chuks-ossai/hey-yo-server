const User = require('../models/user');

const UserController = {
    getMyDetails: async (req, res, next) => {
        const user = await User.findById(req.user._id).populate('post');

        if (!user) {
            const error = new Error('Something went wrong while trying to get user');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: user
        })
    },
}

module.exports = UserController;