const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");

const ChatController = {

    getMessages: async (req, res, next) => {
        const { receiverId } = req.params;

        const conversation = await Chat.findOne({
            $or: [
                {
                    $and: [
                        { 'participants.sender': req.user._id },
                        {'participants.receiver': receiverId }
                    ]
                },
                {
                    $and: [
                        { 'participants.sender': receiverId },
                        { 'participants.receiver': req.user._id }
                    ]
                }
            ]
        }).select('_id')

        if (!conversation) {
            const error = new Error('Something went wrong. Find a conversation');
            error.status = 200;
            return next(error);
        }

        const msg = await Message.findOne({
            conversation: conversation._id
        })

        if (!msg) {
            const error = new Error('Something went wrong. Find a message stream');
            error.status = 200;
            return next(error);
        }

        return await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [msg]
        })
    },

    sendMessage: async (req, res, next) => {

        const { receiverId } = req.params;

        const conversations = await Chat.find({
            $or: [
                { participants: { $elemMatch: { sender: req.user._id, receiver: receiverId } } },
                { participants: { $elemMatch: { sender: receiverId, receiver: req.user._id } } }
            ]
        });

        console.log(conversations.length);
        if (!conversations.length) {
            const newChat = new Chat();

            await newChat.participants.push({
                sender: req.user._id,
                receiver: receiverId
            });

            const savedChat = await newChat.save();

            if (!savedChat) {
                const error = new Error('Something went wrong. Unable to start conversation');
                error.status = 200;
                return next(error);
            }

            console.log(savedChat);
            const newMessage = new Message({
                conversation: savedChat._id,
                senderName: req.user.username,
                receiverName: req.body.receiverName
            })
            await newMessage.messages.push(
                {
                    sender: savedChat.participants[0].sender,
                    receiver: savedChat.participants[0].receiver,
                    body: req.body.message,
                    sentDate: Date.now()
                }
            );

            const savedMessage = await newMessage.save();
            if (!savedMessage) {
                const error = new Error('Something went wrong. Unable to send message');
                error.status = 200;
                return next(error);
            }

            await User.updateOne({
                _id: req.user._id
            }, {
                    $push: {
                    chats: {
                            $each: [
                            {
                                receiver: receiverId,
                                message: savedMessage._id
                            }
                        ]
                    }
                }
            })

            await User.updateOne({
                _id: receiverId
            }, {
                    $push: {
                    chats: {
                            $each: [
                            {
                                receiver: req.user._id,
                                message: savedMessage._id
                            }
                        ]
                    }
                }
            })

            return await res.status(200).json({
                ErrorMessage: null,
                Success: true,
                Results: [{ savedMessage }]
            })
        }

        const updateMessage = await Message.updateOne({
            conversation: conversations[0]._id
        }, {
                $push: {
                messages: {
                    sender: req.user._id,
                    receiver: req.params.receiverId,
                    body: req.body.message,
                    sentDate: Date.now()
                }
            }
        })

        if(!updateMessage.nModified) {
            const error = new Error('Something went wrong. Could not save your message in DB');
            error.status = 200;
            return next(error);
        }

        return await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [{ message: 'Message sent successfully' }]
        })

    }
}

module.exports = ChatController;