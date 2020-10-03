const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ChatSchema = Schema({
    participants: [
        {
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            receiver: { type: Schema.Types.ObjectId, ref: 'User' }
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Chat', ChatSchema);
