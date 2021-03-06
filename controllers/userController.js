// Import model
const Users = require('../models/Users');

// method: GET
// route: /api/user?search={}
// description: Search a user from the query
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
  const users = await Users.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select('-password');
  res.json(users);
};
