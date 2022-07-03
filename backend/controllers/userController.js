// Import user model
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// For input validation
const { body, validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

exports.signup_post = [
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match!');
    }
    return true;
  }),
  (req, res, next) => {
    // Check if there are errors in the form
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: 'Passwords do not match!' });
    }
    // If there are no errors, proceed to save new user to database
    try {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          const user = new Users({
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            displayPhoto: req.body.displayPhoto,
          }).save((err, user) => {
            if (err) {
              return res
                .status(400)
                .json({ message: 'Username already exists' });
            } else {
              return res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                token: generateToken(user._id),
              });
            }
          });
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_post = passport.authenticate('local', {
  successRedirect: '/api/chats',
  failureRedirect: '/login-error',
});

exports.login_get_error = (req, res) => {
  return res.status(401).json({
    message: 'User failed to login. The username or password is incorrect.',
  });
};
