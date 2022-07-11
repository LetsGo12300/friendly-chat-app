const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  displayPhoto: {
    type: String,
    required: true,
    default:
      'https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png',
  },
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
