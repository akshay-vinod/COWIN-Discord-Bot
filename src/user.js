const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    age: Number,
    state_id: Number,
    district_id: Number,
    date: String,
    notify: Boolean,
    daily_notify: Boolean,
    notify_district_id:Number,
    notify_date: String,
    notify_age: Number,
    user_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
