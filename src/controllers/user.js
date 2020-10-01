const User = require('../models/user');

const UserController = {
    getAll: async (req, res, next) => {
        const users = await User.find({_id: {$ne: req.user._id}}).populate('posts').populate('following').populate('followers');

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
        const user = await User.findById(req.user._id).populate('posts').populate('followers').populate('following');

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

    follow: async (req, res, next) => {
        const userId = req.params.id;
        const myId = req.user._id;

        const userFollowing = await User.updateOne({
            _id: myId,
            'following': {$ne: userId}
        }, {
                $push: {
                following: userId
            }
        });

        const userFollower = await User.updateOne({
            _id: userId,
            'followers': {$ne: myId}
        }, {
                $push: {
                followers: myId
            }
        });

        if (!(userFollowing.nModified && userFollower.nModified)) {
            const error = new Error('Allready following user');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [{message: 'Successfully following user', following: userFollowing, follower: userFollower}]
        })
    },

    unfollow: async (req, res, next) => {
        const userId = req.params.id;
        const myId = req.user._id;

        const userFollowing = await User.updateOne({
            _id: myId,
            'following': { $eq: userId }
        }, {
            $pull: {
                following: userId
            }
        });

        const userFollower = await User.updateOne({
            _id: userId,
            'followers': { $eq: myId }
        }, {
            $pull: {
                followers: myId
            }
        });

        if (!(userFollowing.nModified && userFollower.nModified)) {
            const error = new Error('This user is not followed initially');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [{ message: 'Successfully unfollowed user' }]
        })
    },
}

module.exports = UserController;