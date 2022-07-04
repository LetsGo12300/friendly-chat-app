// Import models
const Users = require('../models/Users');
const Chats = require('../models/Chats');

//@description     Create or fetch One to One Chat, request body must be "userID"
//@route           POST /api/chat/
exports.chat_post = async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    console.log('User ID not provided');
    return res.sendStatus(400);
  }

  let isChat = await Chats.find({
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: userID } } },
    ],
    isGroupChat: false,
  }).populate('members', '-password');
  //     .populate('latestMessage');

  //   isChat = await Users.populate(isChat, {
  //     path: 'latestMessage.sender',
  //     select: 'name displayPhoto',
  //   });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    const chatData = {
      chatName: 'New Chat',
      isGroupChat: false,
      members: [req.user._id, userID],
    };

    try {
      // If no chat found between the 2 users, create a new chat
      const newChat = await Chats.create(chatData);
      const Chat = await Chats.findOne({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(Chat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
exports.chats_get = async (req, res) => {
  try {
    Chats.find({ members: { $elemMatch: { $eq: req.user._id } } })
      .populate('members', '-password')
      .populate('admin', '-password')
      .sort({ updatedAt: -1 })
      .then((chats) => {
        // results = await Users.populate(results, {
        //   path: 'latestMessage.sender',
        //   select: 'name pic email',
        // });
        res.status(200).json(chats);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
exports.createGroupChat_post = async (req, res) => {
  if (!req.body.members || !req.body.chatName) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  let members = JSON.parse(req.body.members);

  if (members.length < 2) {
    return res
      .status(400)
      .send(
        'Failed to create a group chat. A group chat must have more than 2 members'
      );
  }

  members.push(req.user);

  try {
    const newGroupChat = await Chats.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      admin: req.user,
      members,
    });

    const groupChat = await Chats.findOne({ _id: newGroupChat._id })
      .populate('members', '-password')
      .populate('admin', '-password');

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
exports.renameGroupChat_put = async (req, res) => {
  const { chatID, chatName } = req.body;

  const updatedChat = await Chats.findByIdAndUpdate(
    chatID,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('members', '-password')
    .populate('admin', '-password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(updatedChat);
  }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
exports.removeUser_put = async (req, res) => {
  const { userID, chatID } = req.body;

  // If user is not the admin, don't proceed to update the group members
  const groupChat = await Chats.findById(chatID);
  if (groupChat.admin._id.toString() === req.user._id.toString()) {
    const updatedChat = await Chats.findByIdAndUpdate(
      chatID,
      {
        $pull: { members: userID },
      },
      {
        new: true,
      }
    )
      .populate('members', '-password')
      .populate('admin', '-password');

    if (!updatedChat) {
      res.status(404);
      throw new Error('Chat Not Found');
    } else {
      res.json(updatedChat);
    }
  } else {
    res.status(403).json({
      message:
        "You don't have the rights to remove this user to the group. Contact the admin.",
    });
  }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
exports.addUser_put = async (req, res) => {
  const { userID, chatID } = req.body;

  // If user is not the admin, don't proceed to update the group members
  const groupChat = await Chats.findById(chatID);
  if (groupChat.admin._id.toString() === req.user._id.toString()) {
    const updatedChat = await Chats.findByIdAndUpdate(
      chatID,
      {
        $push: { members: userID },
      },
      {
        new: true,
      }
    )
      .populate('members', '-password')
      .populate('admin', '-password');

    if (!updatedChat) {
      res.status(404);
      throw new Error('Chat Not Found');
    } else {
      res.json(updatedChat);
    }
  } else {
    res.status(403).json({
      message:
        "You don't have the rights to add this user to the group. Contact the admin.",
    });
  }
};
