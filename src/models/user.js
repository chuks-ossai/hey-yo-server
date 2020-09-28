const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: {type: String},
  lastName: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
