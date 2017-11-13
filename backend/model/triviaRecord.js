var mongoose = require("mongoose");

module.exports= new mongoose.Schema ({
  category: String,
  difficulty: String,
  date: { type: Date, default: Date.now },
  timeTaken: String,
  corrects: String,
  incorrects: String,
  quizes: []
})
