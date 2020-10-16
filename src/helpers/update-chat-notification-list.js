const User = require('../models/user');

const updateChatNotificationList = async (req, message) => {
    try {
        await User.updateOne({
            _id: req.user._id
        }, {
                $pull: {
                chats: {
                    receiver: req.params.receiverId 
                }
            }
        })
        await User.updateOne({
            _id: req.params.receiverId
        }, {
                $pull: {
                chats: {
                    receiver: req.user._id 
                }
            }
        })

        await User.updateOne({
            _id: req.user._id
        }, {
            $push: {
                chats: {
                    $each: [
                        {
                            receiver: req.params.receiverId,
                            message: message._id
                        }
                    ],
                    $position: 0
                }
            }
        })

        await User.updateOne({
            _id: req.params.receiverId
        }, {
            $push: {
                chats: {
                    $each: [
                        {
                            receiver: req.user._id,
                            message: message._id
                        }
                    ],
                    $position: 0
                }
            }
        })
    } catch (err) {
        return { errorMsg: err }
    }
};

module.exports = updateChatNotificationList;