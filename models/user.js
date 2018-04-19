const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
	first_name:  String,
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
})

UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', UserSchema)

module.exports = User
