const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const { chats } = require('./data/data');

// Add dotenv config
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect mongoDB database
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sandbox.53gsr.mongodb.net/Clubhouse?retryWrites=true&w=majority`,
  { useUnifiedTopology: true }
);

// Check if connected to database:
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to Database');
});
db.on('error', (err) => {
  console.error('connection error:', err);
});

const app = express();

app.use(express.json()); // to accept json data
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.get('/api/chat', (req, res) => {
  res.json(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});

app.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
