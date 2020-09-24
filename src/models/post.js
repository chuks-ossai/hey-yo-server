const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String, default: '' },
            createdAt: {type: Date, default: Date.now()}
        }
    ],
    likes: [
        {
            username: { type: String, default: '' }
        }
    ],
    totalLikes: { type: Number, default: 0 }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);
