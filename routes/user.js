/**
 * Module that holds the API routes for obtaining and manipulating users in the database. 
 * @module routes/user
 * @memberof namespace:routes
 */

/**
 * The Express.js namespace
 * @const {Object}
 */
const express = require('express')

/**
 * This router object
 * @const {Object}
 */
const router = express.Router()

/**
 * The controller which holds the logic for each route
 * @const {Object}
 * @see {@link controllers/users} For more information on how the routes work
 */
const users = require('../controllers/users.js')

/**
 * Route to create and register a user
 * @function POST /api/user/register
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/register', users.postUser)

/**
 * Route to update an user's information
 * @function POST /api/user/update
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/update', users.updateUser)

/**
 * Route to validate and sign in an user
 * @function POST /api/user/login
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/login', users.loginUser)

/**
 * Route to update an user's password
 * @function POST /api/user/changepassword
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/changepassword', users.changePassword)

/**
 * Route to generate a password change token and send an email to the user for password recovery
 * @function POST /api/user/forgotpassword
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/forgotpassword', users.forgotPassword)

/**
 * Route to reset an user
 * @function POST /api/user/reset/:token
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/reset/:token', users.resetPassword)

/**
 * Route to recover username
 * @function POST /api/user/forgotusername
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.post('/user/forgotusername', users.forgotName)

/**
 * Route to sign out an user
 * @function GET /api/user/logout
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.get('/user/logout', users.logoutUser)

/**
 * Route to obtain an user's information
 * @function GET /api/user/status
 * @param {Object} req The incoming request object from Express.js
 * @param {Object} res The placeholder response object
 * @param {Object} next The next middleware in the Express.js chain
 */
router.get('/user/status', users.getUserStatus)

module.exports = router
