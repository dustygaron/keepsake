require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
var moment         = require('moment');
hbs.moment = moment;
hbs.registerHelper('moment', function(context, options) {
  return moment(context).format(options.hash.format);
});

hbs.registerHelper('moment-age', function(context, options) {
  var creationDate = new moment(context)
  var childDob = new moment(options.hash.childDob)
  var duration = creationDate.diff(childDob, 'years')
  return duration
});

module.exports = hbs;
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session      = require("express-session");
const MongoStore= require("connect-mongo")(session);
const passport     = require("passport");
const LocalStrategy= require("passport-local").Strategy;

const User         = require('./models/User');
const bcrypt       = require('bcryptjs');
const flash        = require("connect-flash");

mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Keepsake App';

// version without passport
// app.use(session({
//   secret: "shhhhhsupersecret",
//   cookie: { maxAge: 60000 },
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection,
//     ttl: 24 * 60 * 60 // 1 day
//   })
// }));


// version with passport - you can save a secret variable with the session 
app.use(session({
  secret: "anysecretword",
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage=req.flash('success');
  next();
});

// ROUTES 

const userRoutes = require('./routes/user-routes');
app.use(userRoutes)

const feedRoutes = require('./routes/feed-routes');
app.use('/feed', feedRoutes);

const childFeedRoutes = require('./routes/child-feed-routes');
app.use('/feed', childFeedRoutes);

const feedApiRoutes = require('./routes/feed-api-routes');
app.use('/', feedApiRoutes);


module.exports = app;
