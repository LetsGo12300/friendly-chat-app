const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Messages',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Chats = mongoose.model('Chats', ChatsSchema);
module.exports = Chats;
