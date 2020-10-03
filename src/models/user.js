const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: {type: String},
  lastName: { type: String },
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'} ],
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  notifications: [{
    senderName: { type: String },
    message: { type: String },
    profileViewed: { type: Boolean, default: false },
    created: { type: Date },
    read: { type: Boolean, default: false }, 
    date: { type: String }
  }],
  chats: [
    {
      receiver: { type: Schema.Types.ObjectId, ref: 'User' },
      message: { type: Schema.Types.ObjectId, ref: 'Message' }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
