const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login_post);
router.post('/signup', userController.signup_post);

module.exports = router;
