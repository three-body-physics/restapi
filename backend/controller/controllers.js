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

//middelware for checking if User logged in is admin or not, token from header is decoded and verified to see if it belongs to Admin

module.exports.adminAuth = function(req, res, next) {

    if (req.body.username === "admin") {

        var authHeader = req.header("Authorization");

        if (authHeader) {

            var bearer = authHeader.split(" ");
            var token = bearer[1];

            jwt.verify(token, secret.key, function(err, decoded) {
                if (err) {

                    console.log("jwt error");

                    res.json({
                        success: false,
                        message: err
                    });

                } else {


                    User.authenticate(decoded._doc.username, "admin", function(err, user) {
                        if (err || !user) {
                            res.json({
                                success: false,
                                error: err,
                                message: "Denied, no access"
                            });

                            console.log("user auth error one")

                        } else if (user) {

                            Post.find({}, function(err, posts) {

                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });


                                } else {

                                    res.json({
                                        success: true,
                                        message: "Fetched all entries",
                                        entries: posts
                                    });

                                }
                            });


                        } else {

                            console.log("user error two");

                            res.json({
                                success: false,
                                message: "Authorization required."
                            });

                        }
                    });

                }
            });

        } else {
            return next();
        }

    } else {
        return next();
    }
}


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
                });
            }

        });
    }
}

module.exports.userProfile = function(req, res) {
    var userId = req.body.userId;
    var username = req.body.username;

    Post.find({ author: username }, function(err, posts) {
        if (err) {

            res.json({
                success: false,
                message: err
            });
        } else {

            res.json({
                success: true,
                message: "Posts retrieved.",
                entries: posts

            });

        }
    });

}

// logic for API data requests

module.exports.sayHello = function(req, res) {
    res.send("hello from API");
}

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
            res.json({
              success: false,
              message: "Error, entries can't be retrieved."
            });
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
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                message: "Success, entry saved!"
            });
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
                    res.json({
                        success: false,
                        message: err
                    });

                } else {

                    comment.author.id = req.body.userId;
                    comment.author.username = req.body.username;
                    comment.date = req.body.date;
                    comment.save();
                    console.log(post.comments);
                    //post.comments.push(comment); deprecated
                    post.comments = post.comments.concat(comment); 
                    post.save(function(err, post, num) {

                        if (err) {
                            res.json({
                                success: false,
                                message: "Comment posting failed"
                            })
                        } else {

                            Post.findById(id).populate("comments").exec(function(err, foundpost) {

                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {

                                    res.json({
                                        success: true,
                                        message: "Comment posted!",
                                        post: foundpost
                                    });

                                }

                            });

                        }

                    });

                }
            })
        }
    })

}

module.exports.deleteEntry = function(req, res) {

    Post.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.json({
                success: false,
                message: err
            });
        } else {
            res.json({
                success: true,
                message: "Entry deleted."
            });
        }
    });

}