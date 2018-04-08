var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

    var userSchema = new Schema({
        first_name:  String,
        last_name: String,
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
      });
	  userSchema.plugin(passportLocalMongoose);
	  
module.exports = User = mongoose.model('User',userSchema);