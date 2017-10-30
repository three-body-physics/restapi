var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},

	password: {
		type: String,
		required: true
	}
});

UserSchema.statics.authenticate = function(username, password, cb) {
	this.findOne({ username: username }).exec(function(err, user){
		if (err) {
			return cb(err);
		} else if(!user) {
			var error = new Error("User not found!");
			return cb(error, null);
		} 
		bcrypt.compare(password, user.password, function(err, matchResult) {
			if (matchResult === true) {
				return cb(null, user);
			} else {
				return cb();
			}
		});
	});
}

UserSchema.pre("save", function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		} 
		user.password = hash;
		next();
	});
});

module.exports = UserSchema;