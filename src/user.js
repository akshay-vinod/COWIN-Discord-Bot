const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String
    },
    age: Number,
    state_id: Number,
    district: String,

},{timestamps: true});

module.exports = mongoose.model("User",userSchema);