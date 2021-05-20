const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
    },
    age: Number,
    state_id: Number,
    district_id: Number,
    date: String,
    notify: Boolean,
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
