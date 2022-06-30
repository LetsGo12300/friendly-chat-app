const express = require('express');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});

app.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
