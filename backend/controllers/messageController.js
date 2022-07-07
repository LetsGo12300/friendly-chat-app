// Import Messages model
const Messages = require('../models/Messages');
const Users = require('../models/Users');
const Chats = require('../models/Chats');

// method: GET
// /api/message/:chatID
exports.msg_get = async (req, res) => {
  const chatID = req.params.chatID;
  try {
    const allMessages = await Messages.find({ chatID: chatID })
      .populate('sender', 'name username displayPhoto')
      .populate('chatID');
    res.json(allMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// method: POST
// /api/message/
exports.msg_post = async (req, res) => {
  const { message, chatID } = req.body;
  const messageData = {
    message: message,
    chatID: chatID,
    sender: req.user._id,
  };

  // save message to database
  try {
    let newMessage = await Messages.create(messageData);

    newMessage = await newMessage.populate('sender', 'name displayPhoto');
    newMessage = await newMessage.populate('chatID');
    await Users.populate(newMessage, {
      path: 'chatID.members',
      select: 'name username displayPhoto',
    });

    await Chats.findByIdAndUpdate(chatID, {
      lastMessage: newMessage,
    });

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
