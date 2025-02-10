const mongoose = require("mongoose");

const watchProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
    timestamp: { type: Number, required: true }, // Store time in seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchProgress", watchProgressSchema);
