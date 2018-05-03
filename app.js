/**
 * The entry point to the Express.js application. In here the application is configured and the middleware chain is set. It is also here where the connection to the mongoose database is established and configured.
 * @module app
 */

/**
 * The Express.js namespace from which the application is extended
 * @const {Object}
 */
const express = require('express')

/**
 * The express-session component for managing sessions and access tokens
 * @const {Object}
 */
const session = require('express-session')

const path = require('path')

const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressSanitizer = require('express-sanitizer')
const cors = require('cors')

const MongoStore = require('connect-mongo')(session)

/**
 * The mongoose namespace to create a connection with the database
 * @const {Object}
 */
const mongoose = require('mongoose')

const hash = require('bcrypt-nodejs')

/**
 * The passport module for authentication
 * @const {Object}
 */
const passport = require('passport')
const localStrategy = require('passport-local').Strategy

/**
 * App represents the entire application, holds the routes and configuration
 * @const {Object}
 */
const app = express()

var User = require('./models/user')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Mongoose connection
mongoose.connect('mongodb://jesus:1455103429@ds111648.mlab.com:11648/versity')
mongoose.Promise = global.Promise

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(expressSanitizer())
app.use(cors({ credentials: true, origin: true }))

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		url: 'mongodb://jesus:1455103429@ds111648.mlab.com:11648/versity',
		ttl: 1 * 1 * 60 * 60
	})
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

// configure passport
//authenticate function passport provides for you
passport.use('local', new localStrategy(User.authenticate()))
//Passport will maintain persistent login sessions. 
//In order for persistent sessions to work, the authenticated user must be 
//serialized to the session, and deserialized when subsequent requests are made.
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/api', require('./routes/user'))
app.use('/api', require('./routes/course'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
