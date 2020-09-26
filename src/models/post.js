const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const PostSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            username: { type: String },
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
