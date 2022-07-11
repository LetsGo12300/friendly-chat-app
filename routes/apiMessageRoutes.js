const express = require('express');
const router = express.Router();

// Import controller
const messageController = require('../controllers/messageController');

router.post('/', messageController.msg_post);
router.get('/:chatID', messageController.msg_get);

module.exports = router;
