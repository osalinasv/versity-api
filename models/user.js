const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')

/**
 * The User mongoose schema
 * @class
 * @property {String} firstName The user's first name
 * @property {String} lastName The user's last name
 * @property {String} username The user's unique username
 * @property {String} email The user's unique email
 * @property {String} password The user's hashed password
 * @property {String} resetPasswordToken Expirable token for resetting a password
 * @property {Date} resetPasswordExpires Expiration date for the token
 */
const UserSchema = new Schema({
	first_name: String,
	last_name: String,
	username: { 
		type: String, 
		required: true, 
		unique: true
	},
	email: { 
		type: String, 
		required: true, 
		unique: true
	},
	password: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
}, {
	timestamps: true
})

UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', UserSchema)

module.exports = User
