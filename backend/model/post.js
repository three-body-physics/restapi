var mongoose = require("mongoose");

module.exports= new mongoose.Schema ({
  name: String,
  image: String,
  text: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
})
