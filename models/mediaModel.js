const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    tags: [{ type: String }],
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ["video", "audio"], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
