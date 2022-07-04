// Import model
const Users = require('../models/Users');

exports.users_get = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { name: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  // Search for all users except for the logged in user
  const users = await Users.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json(users);
};
