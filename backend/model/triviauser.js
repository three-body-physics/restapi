var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var triviaUserSchema = new mongoose.Schema({

	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},

	password: {
		type: String,
		required: true
	},

	records: [{
		type: mongoose.Schema.Types.ObjectId,
    	ref: "triviaRecord"
	}],


});

triviaUserSchema.statics.authenticate = function(username, password, cb) {
	this.findOne({ username: username }).exec(function(err, user){
		if (err) {
			return cb(err, null);
		} 

		else if(!user) {
			var error = "Error user not found!";
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

triviaUserSchema.pre("save", function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		} 
		user.password = hash;
		next();
	});
});

module.exports = triviaUserSchema;