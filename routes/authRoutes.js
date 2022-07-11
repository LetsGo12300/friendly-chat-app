const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login-error', authController.login_get_error);
router.post('/login', authController.login_post);
router.post('/signup', authController.signup_post);

module.exports = router;
