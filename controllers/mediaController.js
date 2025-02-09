const Media = require('../models/mediaModel');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

// Get all media with pagination
const getAllMedia = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const media = await Media.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: "Error fetching media", error });
    }
};

// Search media by title, category, or description
const searchMedia = async (req, res) => {
    try {
        const { q } = req.query;
        const media = await Media.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        });

        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: "Error searching media", error });
    }
};

// Get media by ID
const getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: "Error fetching media", error });
    }
};

// Upload media (Admin Only)
const uploadMedia = async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });

        // Determine media type
        let mediaType;
        if (result.is_audio) {
            mediaType = "audio";
        } else{
            mediaType = "video";
        }

        console.log(result);
        console.log(mediaType);
        console.log(req.body);

        req.body.tags = Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags);
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
        res.status(201).json({ message: "Media uploaded successfully", media: newMedia });
};

// Delete media (Admin Only)
const deleteMedia = async (req, res) => {

    const media = await Media.findById(req.params.id);
    if (!media) {
        return res.status(404).json({ message: "Media not found" });
    }

    // Delete from Cloudinary
    const publicId = media.mediaUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

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
                return res.status(400).json({ message: "Invalid tags format. Must be an array." });
            }
        }

        // Check if a new file is uploaded
        if (req.file) {
            // Upload new media to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto', folder: 'clinikk_tv/media' });

            // Extract old media's public_id and delete it from Cloudinary
            const oldPublicId = media.mediaUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`clinikk_tv/media/${oldPublicId}`, { resource_type: 'video' });

            // Set new media URL and determine media type
            updatedFields.mediaUrl = result.secure_url;
            updatedFields.type = result.is_audio ? "audio" : "video";

            // Remove temporary uploaded file from server
            fs.unlinkSync(req.file.path);
        }
        
        console.log(updatedFields);
        // Update media in MongoDB
        media = await Media.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        res.status(200).json({ message: "Media updated successfully", media });
};

// Get all available categories
const getCategories = async (req, res) => {
    try {
        const categories = await Media.distinct("category");
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

module.exports = { getAllMedia, searchMedia, getMediaById, uploadMedia, deleteMedia, updateMedia, getCategories };
