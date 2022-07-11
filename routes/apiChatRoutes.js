const express = require('express');
const router = express.Router();

// Import controller
const chatController = require('../controllers/chatController');

router.post('/', chatController.chat_post);
router.get('/', chatController.chats_get);
router.post('/creategroup', chatController.createGroupChat_post);
router.put('/rename', chatController.renameGroupChat_put);
router.put('/removeuser', chatController.removeUser_put);
router.put('/adduser', chatController.addUser_put);

module.exports = router;
