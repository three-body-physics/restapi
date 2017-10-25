var mongoose = require("mongoose");
var campSchema  = require("./../model/post.js");
var commentSchema = require("./../model/comments.js");

mongoose.connect("mongodb://localhost/campsites");

var Campsite = mongoose.model("Campsite", campSchema);
var Comment = mongoose.model("Comment", commentSchema);

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

module.exports.updateEntry = function(req, res) {

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
