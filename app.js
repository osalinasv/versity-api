const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const hash = require('bcrypt-nodejs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const app = express();

var User = require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Mongoose connection
mongoose.connect('mongodb://jesus:1455103429@ds111648.mlab.com:11648/versity');
mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSanitizer());
app.use(cors({ credentials: true, origin: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://jesus:1455103429@ds111648.mlab.com:11648/versity',
        ttl: 1 * 1 * 60 * 60
      })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// configure passport
//authenticate function passport provides for you
passport.use('local', new localStrategy(User.authenticate()));
//Passport will maintain persistent login sessions. 
//In order for persistent sessions to work, the authenticated user must be 
//serialized to the session, and deserialized when subsequent requests are made.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', require('./routes/index'));
app.use('/api', require('./routes/user'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;