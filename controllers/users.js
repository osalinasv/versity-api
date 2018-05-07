/**
 * The controller for the User routes
 * @module
 */

const mongoose = require('mongoose')

/**
 * The User model
 * @const
 */
const User = require('../models/user')

/**
 * The passport namespace
 * @const
 */
const passport = require('passport')

/**
 * The crypto namespace
 * @const
 */
const crypto = require('crypto')

/**
 * The postmark namespace
 * @const
 */
const postmark = require('postmark')

const async = require('async')

/**
 * The Postmark unique client id
 * @const
 */
const client = new postmark.Client(
	'99524476-87e5-4b8c-b838-b143918a9a23'
)

module.exports = {
	/**
	 * Get all users' data
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	getUsers: function(req, res, next) {
		var firstName = req.params.firstName
		User.find(function(err, users) {
			if (err) return console.error(err)
			res.send(users)
		})
	},

	/**
	 * Get a user's data from the request parameters of the form:
	 * ```
	 * req.params: {
	 * 	username: String
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	getUserProfile: function(req, res, next) {
		var username = req.params.username
		User.find(function(err, users) {
			if (err) return console.error(err)
			res.send(users)
		})
	},

	/**
	 * Create and save an user from the request body of form:
	 * ```
	 * req.body: {
	 * 	firstName: String,
	 * 	lastName: String,
	 * 	userName: String,
	 * 	password: String,
	 * 	email: String
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	postUser: function(req, res, next) {
		User.find({email: req.body.email}, function(err, user){
			if(err){
				return res.status(500).json({
					message: err
				})
			}
			if(user.length > 0){
				if(user[0].email == req.body.email){
					return res.status(401).json({
						message: 'A user with the given email is already registered.'
					})
				}
			}
			if(user.length < 1){
				User.register(
					new User({
						first_name: req.body.firstName,
						last_name: req.body.lastName,
						email: req.body.email,
						username: req.body.userName
					}),
					req.body.password,
					function(err, account) {
						if (err) {
							return res.status(401).json({
								err: err
							})
						} else {
							return res.status(200).send(account)
						}
					}
				)
			}
		})
	},

	/**
	 * Update an user from the request body of form:
	 * ```
	 * req.body: {
	 * 	_id: String,
	 * 	firstName: String,
	 * 	lastName: String,
	 * 	userName: String,
	 * 	email: String
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	updateUser: function(req, res, next) {
		var query = { _id: req.body._id }
		var updateUser = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			username: req.body.username
		}
		if (
			!updateUser.firstname ||
			!updateUser.lastname ||
			!updateUser.email ||
			!updateUser.username
		) {
			return res.status(401).json({
				message: 'One or more fields are empty'
			})
		} else {
			User.update(query, updateUser, function(err, result) {
				if (err) {
					return res.status(401).json({
						err: err,
						message: 'User not Updated'
					})
				}
				if (result) {
					return res.status(200).json({
						success: result,
						message: 'User Updated'
					})
				}
			})
		}
	},

	/**
	 * Change an users password from the request body of form:
	 * ```
	 * req.body: {
	 * 	_id: String,
	 * 	oldPassword: String,
	 * 	confirmNewPassword: String
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	changePassword: function(req, res, next) {
		var oldPassword = req.body.oldPassword
		var confirmNewPassword = req.body.confirmNewPassword
		User.findById(req.user._id, function(err, user) {
			if (err) {
				return next(err)
			}
			user.changePassword(oldPassword, confirmNewPassword, function(
				changePassErr,
				user
			) {
				if (changePassErr) {
					return res.status(500).json({
						message: changePassErr
					})
				}
				return res.status(200).json({
					message: 'Password has been updated'
				})
			})
		})
	},

	/**
	 * Send restoration email and set token from the request body of form:
	 * ```
	 * req.body: {
	 * 	username: String
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	forgotPassword: function(req, res, next) {
		async.waterfall(
			[
				function(done) {
					crypto.randomBytes(20, function(err, buf) {
						var token = buf.toString('hex')
						done(err, token)
					})
				},
				function(token, done) {
					User.findOne({ username: req.body.username }, function(err, user) {
						if (err) {
							return res.status(500).json({
								message: err
							})
						}
						if (!user) {
							return res.status(500).json({
								message: 'No user with that username'
							})
						}
						if (user) {
							user.resetPasswordToken = token
							user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

							user.save(function(err) {
								done(err, token, user)
							})
						}
					})
				},
				function(token, user, done) {
					client.sendEmailWithTemplate({
						From: 'rene.osman@nih.gov',
						To: user.email,
						TemplateId: 4884721,
						TemplateModel: {
							product_name: 'Node-Mongo',
							product_url: 'http://' + req.headers.host,
							name: user.firstname,
							action_url: 'http://' + req.headers.host + '/#/reset/' + token
						}
					})
					if (done) {
						return res.status(200).json({
							message:
								'An email has been sent to ' +
								user.email +
								' with further instructions.'
						})
					}
				}
			],
			function(err) {
				return res.status(500).json({
					message: err
				})
			}
		)
	},

	/**
	 * Reset an users's password from the request form:
	 * ```
	 * req: {
	 * 	params: {
	 * 		token: String
	 * 	},
	 * 	body: {
	 * 		confirmNewPassword: String
	 * 	}
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	resetPassword: function(req, res, next) {
		async.waterfall(
			[
				function(done) {
					User.findOne(
						{
							resetPasswordToken: req.params.token,
							resetPasswordExpires: { $gt: Date.now() }
						},
						function(err, user) {
							if (err) {
								return res.status(500).json({
									message: err
								})
							}
							if (!user) {
								return res.status(500).json({
									message: 'Password reset token is invalid or has expired'
								})
							}
							if (user) {
								user.setPassword(req.body.confirmNewPassword, function(
									setPasswordErr,
									user
								) {
									if (setPasswordErr) {
										return res.status(500).json({
											message: setPasswordErr
										})
									}
									if (user) {
										user.save(function(err) {
											req.logIn(user, function(err) {
												done(err, user)
											})
										})
									}
								})
							}
						}
					)
				},
				function(user, done) {
					return res.status(200).json({
						message: 'Password has been updated'
					})
				}
			],
			function(err) {
				return res.status(500).json({
					message: err
				})
			}
		)
	},

	/**
	 * Recover username from the request body of form:
	 * ```
	 * req.body: {
	 * 	email: String,
	 * 	
	 * }
	 * ```
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	forgotName: function(req, res, next) {
		if (!req.body.email) {
			return res.status(500).json({
				message: 'You did not enter an email.'
			})
		} else {
			async.waterfall(
				[
					function(done) {
						User.findOne(
							{
								email: req.body.email
							},
							function(err, user) {
								if (err) {
									return res.status(500).json({
										message: err
									})
								}
								if (!user) {
									return res.status(500).json({
										message: 'This email is not registered to a user.'
									})
								}
								if (user) {
									client.sendEmailWithTemplate({
										From: 'rene.osman@nih.gov',
										To: user.email,
										TemplateId: 4888201,
										TemplateModel: {
											product_name: 'Node-Mongo',
											product_url: 'http://' + req.headers.host,
											name: user.firstname,
											username: user.username,
											action_url: 'http://' + req.headers.host + '/#/login'
										}
									})
									return res.status(200).json({
										message:
											'An email has been sent to ' +
											user.email +
											' with further instructions.'
									})
								}
							}
						)
					}
				],
				function(err) {
					return res.status(500).json({
						message: err
					})
				}
			)
		}
	},

	/**
	 * Sign in an user
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	loginUser: function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err)
			}
			if (!user) {
				return res.status(401).json({
					err: info
				})
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({
						err: err,
						message: 'Could not log in user'
					})
				}
				res.status(200).json({
					message: 'Login successful!'
				})
			})
		})(req, res)
	},

	/**
	 * Sign out an user and delete session token
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	logoutUser: function(req, res, next) {
		req.logout()
		res.status(200).json({
			message: 'User Logged out',
			user: false
		})
	},

	/**
	 * Get an user's data if the user is athenticated
	 * @param {Object} req The incoming request object from Express.js
	 * @param {Object} res The placeholder response object
	 * @param {Object} next The next middleware in the Express.js chain
	 */
	getUserStatus: function(req, res, next) {
		if (req.isAuthenticated()) {
			res.status(200).json({
				status: true,
				user: req.user
			})
		}
		if (!req.isAuthenticated()) {
			res.status(200).json({
				status: false,
				user: false
			})
		}
	}
}
