const express = require('express');
const router = express.Router();

const { chats } = require('../data/data');

router.get('/chats', (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
  });
});

router.get('/chat/:id', (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});

module.exports = router;
