const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MessageSchema = Schema({
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    messages: [
        {
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            receiver: { type: Schema.Types.ObjectId, ref: 'User' },
            body: {type: String, default: ''},
            isRead: {type: Boolean, default: false},
            sentDate: {type: Date}
        }
    ],
    senderName: { type: String },
    receiverName: { type: String }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Message', MessageSchema);
