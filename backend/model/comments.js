var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comment: String,
    date: String
});