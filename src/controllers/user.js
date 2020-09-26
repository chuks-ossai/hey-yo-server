const User = require('../models/user');

const UserController = {
    getAllMyPosts: async (req, res, next) => {
        const user = await User.findOne({ _id: req.user._id }).populate('posts').execPopulate();
        if (!user.populated('posts')) {
            const error = new Error('No user found');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: user.posts
        })
    }
}

module.exports = UserController;