const WatchProgress = require("../models/watchProgressModel");

// Save watch progress
exports.saveWatchProgress = async (req, res) => {
    try {
        const { id: mediaId } = req.params;
        const userId = req.user.id;
        const { timestamp } = req.body;

        await WatchProgress.findOneAndUpdate(
            { userId, mediaId },
            { timestamp },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Watch progress saved" });
    } catch (error) {
        res.status(500).json({ message: "Error saving progress", error });
    }
};

// Get saved progress
exports.getWatchProgress = async (req, res) => {
    try {
        const { id: mediaId } = req.params;
        const userId = req.user.id;

        const progress = await WatchProgress.findOne({ userId, mediaId });
        res.status(200).json(progress || { timestamp: 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress", error });
    }
};
