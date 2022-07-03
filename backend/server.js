const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');

// Import routes
const userRouter = require('./routes/userRoutes');
const apiRouter = require('./routes/apiRoutes');

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
    cookie: { maxAge: 3600000 },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(express.json()); // to accept json data
app.use(cors());

// Use routes
app.use('/', userRouter);
app.use('/api', apiRouter);

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

// Access the user object from anywhere
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
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

app.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
