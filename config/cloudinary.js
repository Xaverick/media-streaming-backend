const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const allowedMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'audio/mpeg', 'audio/mp3', 'audio/wav'];

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './public/temp';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Multer Filter to Check File Type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only video and audio files are allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });

// Function to Upload File to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'clinikk_tv/media'
    });

    if (!result) {
      throw new Error("Upload failed");
    }

    // Delete the temp file from the server after uploading
    fs.unlinkSync(localFilePath);
    return result.secure_url;

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

module.exports = { cloudinary, upload, uploadOnCloudinary };
