const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

router.get('/', userController.users_get);

module.exports = router;
