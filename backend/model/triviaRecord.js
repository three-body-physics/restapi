var mongoose = require("mongoose");

module.exports= new mongoose.Schema ({
  category: String,
  difficulty: String,
  date: { type: Date, default: Date.now },
  timeTaken: Number,
  corrects: Number,
  incorrects: Number,
  quizes: []
})
