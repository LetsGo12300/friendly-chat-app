const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  message: {
    type: String,
    trim: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  chatID: {
    type: Schema.Types.ObjectId,
    ref: 'Chats',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Messages = mongoose.model('Messages', MessagesSchema);
module.exports = Messages;
