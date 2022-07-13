// Import user model
const Users = require('../models/Users');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// For input validation
const { body, validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

// method: POST
// route: /signup
// description: Sign up user with validation (express validator)
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
              return res
                .status(201)
                .json({ message: 'Registration successful' });
            }
          });
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

// method: POST
// route: /login
// description: Log in user -> use passport JS (local) to authenticate
// If authenticated, provide user details and JWT token as response
exports.login_post = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login-error');
    }

    req.logIn(user, { session: false }, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        _id: req.user._id,
        displayPhoto: req.user.displayPhoto,
        name: req.user.name,
        username: req.user.username,
        token: 'Bearer ' + generateToken(req.user._id),
      });
    });
  })(req, res, next);
};

// method: GET
// route: /login-error
// description: If user failed to log in, response is redirected to this route
exports.login_get_error = (req, res) => {
  return res.status(401).json({
    message: 'User failed to login. The username or password is incorrect.',
  });
};
