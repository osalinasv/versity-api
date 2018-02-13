const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	first_name: {
		type: String,
		default: null
	},
	last_name: {
		type: String,
		default: null
	},
	username: {
		type: String,
		required: [true, 'User username field is required']
	},
	password: {
		type: String,
		required: [true, 'User pasword field is required']
	}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
