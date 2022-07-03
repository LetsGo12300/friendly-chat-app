const express = require('express');
const router = express.Router();

const { chats } = require('../data/data');

router.get('/chats', (req, res) => {
  res.json(chats);
});

router.get('/chat/:id', (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});

module.exports = router;
