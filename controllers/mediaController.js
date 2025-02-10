const Media = require("../models/mediaModel");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");
const History = require("../models/historyModel");
const jwt = require("jsonwebtoken");

// Get all media with pagination
const getAllMedia = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const media = await Media.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Media.countDocuments();

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: media,
  });
};

// Search media by title, category, or description
const searchMedia = async (req, res) => {
  const { q } = req.query;
  const media = await Media.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ],
  });

  res.status(200).json(media);
};

// Get media by ID
const getMediaById = async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  const token = req.header("Authorization");
  if (token) {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    if (req.user) {
      const userId = req.user.id;
      const existingHistory = await History.findOne({
        userId,
        mediaId: media._id,
      });

      if (!existingHistory) {
        const newHistory = new History({ userId, mediaId: media._id });
        await newHistory.save();
      }
    }
  }
  res.status(200).json(media);
};

// Upload media (Admin Only)
const uploadMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  // Determine media type
  let mediaType;
  if (result.is_audio) {
    mediaType = "audio";
  } else {
    mediaType = "video";
  }

  console.log(result);
  console.log(mediaType);
  console.log(req.body);

  req.body.tags = Array.isArray(req.body.tags)
    ? req.body.tags
    : JSON.parse(req.body.tags);
  console.log(req.body.tags);
  // Delete the temp file from the server after uploading
  fs.unlinkSync(req.file.path);

  // Save media details in DB
  const newMedia = new Media({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags,
    mediaUrl: result.secure_url,
    type: mediaType, // Setting the type dynamically
    uploadedBy: req.user.id, // Assuming user ID is retrieved from authentication
  });

  await newMedia.save();
  res
    .status(201)
    .json({ message: "Media uploaded successfully", media: newMedia });
};

// Delete media (Admin Only)
const deleteMedia = async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  // Delete from Cloudinary
  const publicId = media.mediaUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

  await Media.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Media deleted successfully" });
};

// Update media metadata (Admin Only)
const updateMedia = async (req, res) => {
  // Find the existing media entry
  let media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  let updatedFields = req.body;

  // Parse tags if they are sent as a string (due to FormData)
  if (req.body.tags && typeof req.body.tags === "string") {
    try {
      updatedFields.tags = JSON.parse(req.body.tags);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid tags format. Must be an array." });
    }
  }

  // Check if a new file is uploaded
  if (req.file) {
    // Upload new media to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "clinikk_tv/media",
    });

    // Extract old media's public_id and delete it from Cloudinary
    const oldPublicId = media.mediaUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`clinikk_tv/media/${oldPublicId}`, {
      resource_type: "video",
    });

    // Set new media URL and determine media type
    updatedFields.mediaUrl = result.secure_url;
    updatedFields.type = result.is_audio ? "audio" : "video";

    // Remove temporary uploaded file from server
    fs.unlinkSync(req.file.path);
  }

  console.log(updatedFields);
  // Update media in MongoDB
  media = await Media.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
  });

  res.status(200).json({ message: "Media updated successfully", media });
};

// Get all available categories
const getCategories = async (req, res) => {
  const categories = await Media.distinct("category");
  res.status(200).json(categories);
};

const getRecommendations = async (req, res) => {
    const userId = req.user.id;

    // Get the last watched media categories
    const history = await History.find({ userId }).populate("mediaId");

    if (!history.length) {
      return res
        .status(200)
        .json({ message: "No watch history available", recommendations: [] });
    }

    const categories = history.map((h) => h.mediaId.category);
    const uniqueCategories = [...new Set(categories)];

    // Recommend media from the same categories
    const recommendations = await Media.find({
      category: { $in: uniqueCategories },
    }).limit(10);

    res.status(200).json({ recommendations });
};

module.exports = {
  getAllMedia,
  searchMedia,
  getMediaById,
  uploadMedia,
  deleteMedia,
  updateMedia,
  getCategories,
  getRecommendations,
};
