// Import user model
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// For input validation
const { body, validationResult } = require('express-validator');

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
      console.log('User failed to sign up!');
      // Redirect to home
      return res.redirect('/');
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
            //   displayPhoto: req.body.displayPhoto,
          }).save((err) => (err ? next(err) : res.redirect('/')));
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});
