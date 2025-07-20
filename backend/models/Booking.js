const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  title: String,
  date: String,
  startTime: String,
  endTime: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
const bookingSchema = new mongoose.Schema({
  title: String,
  room: String, // 🆕 Add this
  date: String,
  startTime: String,
  endTime: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
