// require passport packages

var jwt = require("jsonwebtoken");
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

//mongdb and schema configs

var triviaUserSchema = require("./../model/triviauser.js");
var triviaRecordSchema = require("./../model/triviaRecord.js");

var mongoose = require("mongoose");
var secret = require("./secret.js");
mongoose.connect(secret.mongolabURL);

var triviaRecord = mongoose.model("triviaRecord", triviaRecordSchema);
var triviaUser = mongoose.model("triviaUser", triviaUserSchema);

// passport strategy config

var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret.key
}

passport.use("jwt-2", new JwtStrategy(options, function(jwt_payload, done) {

    triviaUser.findOne({

        id: jwt_payload.id

    }, function(err, user) {

        if (user) {

            done(null, user)

        } else {

            done(err, false)

        }
    });
}));


module.exports.userReg = function(req, res) {

    if (!req.body.username || !req.body.password) {

        res.json({
            success: false,
            message: "Please enter the required fields"
        });

    } else {

        var newUser = {
            username: req.body.username,
            password: req.body.password
        };

        triviaUser.create(newUser, function(err, user) {

            if (err) {

                return res.json({
                    success: false,
                    message: "This user already exist"
                });

            } else {

                var token = jwt.sign(user, secret.key, {
                    expiresIn: "10h"
                });


                res.json({
                    success: true,
                    message: "Successfully registered",
                    username: user.username,
                    userId: user._id,
                    token: token
                });

            }

        });

    }
}

module.exports.userLogin = function(req, res) {

    if (!req.body.username || !req.body.password) {

        res.json({
            success: false,
            message: "Please enter the required fields"
        });

    } else {

        triviaUser.authenticate(req.body.username, req.body.password, function(err, user) {

            if (err || !user) {
                res.json({
                    success: false,
                    error: err,
                    message: "Username or password does not match."
                });

            } else if (user) {
                var token = jwt.sign(user, secret.key, {
                    expiresIn: "10h"
                });

                res.json({
                    success: true,
                    message: "Successfully logged in.",
                    token: token,
                    user: user
                });

            } else {
                res.json({
                    success: false,
                    message: "Error User or password does not match."
                });
            }

        });
    }
}

module.exports.updateUserRecord = function(req, res) {

    var userID = req.params.userid;

    triviaUser.findById(userID, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Something went wrong",
                error: err
            });
        } else if (user) {            

            var record = new triviaRecord(req.body.record);

            record.save(function(err) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    })
                } else {

                    user.records.push(record);
                    res.json({
                        success: true,
                        message: "User record updated.",
                        user: user
                    });
                }
            });
        } else {
            res.json({
                success: false,
                message: "user not found",
                error: err
            })
        }
    })
}

module.exports.retreiveUser = function(req, res) {

    var userID = req.params._id;

    triviaUser.findById(userID).populate("records").exec(function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "User not found.",
                error: err
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
}