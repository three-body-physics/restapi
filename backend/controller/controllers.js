var mongoose = require("mongoose");
var _ = require("lodash");

// require passport packages

var jwt = require("jsonwebtoken");
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

//mongdb and schema configs

var campSchema  = require("./../model/post.js");
var commentSchema = require("./../model/comments.js");
var UserSchema = require("./../model/user.js");
var secret = require("./secret.js");

mongoose.connect(secret.mongolabURL);

var Campsite = mongoose.model("Campsite", campSchema);
var Comment = mongoose.model("Comment", commentSchema);
var User = mongoose.model("User", UserSchema);

// passport strategy config


var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret.key
}

passport.use(new JwtStrategy(options, function(jwt_payload, done) {

  User.findOne({

    id: jwt_payload.id

  }, function(err, user) {

    if (err) {
      return done(err, false)
    }

    if (user) {

      done(null, user)

    } else {

      done(null, false)

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

    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    newUser.save(function(err) {
      if(err) {

        return res.json({
          success: false,
          message: "This email address already exist"
      });

      } 

    res.json({
      success: false,
      message: "Successfully registered"
    });
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

Campsite.find({}, function(err, campsites) {
  if (err) {
    console.log(err);
  } else {
    res.json(campsites);
  }
});

}

module.exports.fetchEntry = function(req, res) {

var id = req.params.id;

Campsite.findById(id).populate("comments").exec(function(err, data) {
  if( err) {
    res.json(err);
  } else {
    res.json(data);
  }

});

}

module.exports.createEntry = function(req, res) {

var campData = {
  name: req.body.name,
  image: req.body.image,
  text: req.body.text,
  date: req.body.date
}

var camp = new Campsite(campData);
camp.save(function(err){
  if(err) {
    console.log(err);
  } else {
    res.json({status: "success"});
  }
})

}

module.exports.postComment = function(req, res) {

  var id = req.body._id;
  var comment = req.body.content;

  Campsite.findById(id, function(err, obj) {
    if(err) {
      console.log(err);
      res.json(err);
    } else {
      Comment.create(req.body.content, function(err, comment) {
        if(err) {
          console.log(err);
          res.json(err);
        } else {

          obj.comments.push(comment);
          console.log(comment);
          obj.save();
        }
      })
    }
  })

}

module.exports.deleteEntry = function(req, res) {

  res.redirect("/blogs");

}
