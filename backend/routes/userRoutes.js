const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login-error', userController.login_get_error);

router.post('/login', userController.login_post);
router.post('/signup', userController.signup_post);

module.exports = router;
