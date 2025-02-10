const Watchlist = require("../models/watchlistModel");

// Add media to watchlist
exports.addToWatchlist = async (req, res) => {
    try {
        const { id: mediaId } = req.params;
        const userId = req.user.id;

        const existing = await Watchlist.findOne({ userId, mediaId });
        if (existing) return res.status(400).json({ message: "Already in watchlist" });

        await Watchlist.create({ userId, mediaId });
        res.status(200).json({ message: "Added to watchlist" });
    } catch (error) {
        res.status(500).json({ message: "Error adding to watchlist", error });
    }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
    try {
        const { id: mediaId } = req.params;
        const userId = req.user.id;

        await Watchlist.findOneAndDelete({ userId, mediaId });
        res.status(200).json({ message: "Removed from watchlist" });
    } catch (error) {
        res.status(500).json({ message: "Error removing from watchlist", error });
    }
};

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const watchlist = await Watchlist.find({ userId }).populate("mediaId");

        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching watchlist", error });
    }
};
