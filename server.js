const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const path = require('path');

// Import routes
const authRouter = require('./routes/authRoutes');
const apiUserRouter = require('./routes/apiUserRoutes');
const apiChatRouter = require('./routes/apiChatRoutes');
const apiMessageRouter = require('./routes/apiMessageRoutes');

// Import model
const Users = require('./models/Users');

// Add dotenv config
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect mongoDB database
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sandbox.53gsr.mongodb.net/FriendlyChat?retryWrites=true&w=majority`,
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

// Import middleware for express-session and passport
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json()); // to accept json data
app.use(cors());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// For passport local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username: username.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    function (jwt_payload, done) {
      Users.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

// Access the user object from anywhere
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Use routes
app.use('/', authRouter);
// secure route (must verify JWT token first)
app.use(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  apiUserRouter
);
app.use(
  '/api/chat',
  passport.authenticate('jwt', { session: false }),
  apiChatRouter
);
app.use(
  '/api/message',
  passport.authenticate('jwt', { session: false }),
  apiMessageRouter
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

const server = app.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000, // wait 60s
  cors: {
    origin: ['https://friendlychat-app.herokuapp.com'],
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userID) => {
    socket.join(userID);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    // Leave all current chat rooms
    Array.from(socket.rooms)
      .filter((chatRoom) => chatRoom.includes('CHAT_'))
      .forEach((chatRoom) => {
        socket.leave(chatRoom);
      });
    // Join new chat room
    socket.join('CHAT_' + room);
  });

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chatID;

    if (!chat.members) {
      return console.log('ChatID.members not defined');
    }

    chat.members.forEach((member) => {
      if (member._id === newMessageReceived.sender._id) {
        return;
      }

      socket.in(member._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('typing', (room) => {
    socket.in('CHAT_' + room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in('CHAT_' + room).emit('stop typing');
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
