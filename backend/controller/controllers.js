var mongoose = require("mongoose");
var _ = require("lodash");

// require passport packages

var jwt = require("jsonwebtoken");
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

//mongdb and schema configs

var postSchema = require("./../model/post.js");
var commentSchema = require("./../model/comments.js");
var UserSchema = require("./../model/user.js");
var secret = require("./secret.js");

mongoose.connect(secret.mongolabURL);

var Post = mongoose.model("Post", postSchema);
var Comment = mongoose.model("Comment", commentSchema);
var User = mongoose.model("User", UserSchema);

// passport strategy config


var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret.key
}

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

    User.findOne({

        id: jwt_payload.id

    }, function(err, user) {

        if (user) {

            done(null, user)

        } else {

            done(err, false)

        }
    });
}));

// logic for UserAuth

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

        User.create(newUser, function(err, user) {

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

        User.authenticate(req.body.username, req.body.password, function(err, user) {

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
                })
            }

        });
    }
}





// logic for API data requests

module.exports.sayHello = function(req, res) {
    res.send("hello from API");
}

// module.exports.sendHTML = function(req, res) {

//   res.render("index");

// }

module.exports.fetchEntries = function(req, res) {

    Post.find({}, function(err, posts) {

        if (err) {

            res.json({
                success: false,
                message: "Error cannot find entries"
            });

        } else {

            res.json(posts);

        }
    });

}

module.exports.fetchEntry = function(req, res) {

    var id = req.params.id;

    Post.findById(id).populate("comments").exec(function(err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }

    });

}


// create a new Entry and save to DB

module.exports.createEntry = function(req, res) {

    var postData = {
        name: req.body.name,
        image: req.body.image,
        text: req.body.text,
        author: req.body.author,
        date: req.body.date
    }

    var post = new Post(postData);

    post.save(function(err) {
        if (err) {
            res.json(err);
        } else {
            res.json({ success: true, message: "Success, entry saved!" });
        }
    })

}

module.exports.postComment = function(req, res) {

    var id = req.body._id;


    Post.findById(id, function(err, post) {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            Comment.create(req.body.content, function(err, comment) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    comment.author.id = req.body.userId;
                    comment.author.username = req.body.username;
                    comment.date = req.body.date;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.json({
                        success: true,
                        message: "Comment posted!"
                    })
                }
            })
        }
    })

}

module.exports.deleteEntry = function(req, res) {

    res.redirect("/blogs");

}