const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Booking = require("../models/Booking");

// ✅ POST /api/book
router.post("/", verifyToken, async (req, res) => {
  const { title, room, date, startTime, endTime } = req.body;

  try {
    // 🔒 Time Clash Check
    const clash = await Booking.findOne({
      room,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (clash) {
      return res.status(400).json({ message: "Booking time clashes with another meeting in this room" });
    }

    const newBooking = new Booking({
      title,
      room,
      date,
      startTime,
      endTime,
      userId: req.userId
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created", booking: newBooking });

  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// ✅ GET /api/book/mine
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
});

// ✅ DELETE /api/book/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Booking.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Booking not found or not yours" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
});

// ✅ PUT /api/book/:id (edit)
router.put("/:id", verifyToken, async (req, res) => {
  const { title, room, date, startTime, endTime } = req.body;

  try {
    const updated = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, room, date, startTime, endTime },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Booking not found or unauthorized" });

    res.json({ message: "Booking updated", booking: updated });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
});

// ✅ GET /api/book/all (admin only)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const adminId = "admin_user_mongo_id_here"; // 🔁 Replace with real MongoDB admin _id
    if (req.userId !== adminId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find().populate("userId", "username");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE /api/book/admin/:id (admin only)
router.delete("/admin/:id", verifyToken, async (req, res) => {
  const adminId = "admin_user_mongo_id_here"; // 🔁 Replace with real MongoDB admin _id
  if (req.userId !== adminId) {
    return res.status(403).json({ message: "Only admin can delete any booking" });
  }

  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting", error: err.message });
  }
});

module.exports = router;
