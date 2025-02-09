const History = require('../models/historyModel');

// Get user watch history
const getUserHistory = async (req, res) => {
    const history = await History.find({ userId: req.user.id }).populate('mediaId');
    res.status(200).json(history);
    
};

const deleteHistoryItem = async (req, res) => {
    try {
        const { mediaId } = req.params;
        await History.findOneAndDelete({ userId: req.user.id, mediaId });

        res.status(200).json({ message: "History item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting history item", error });
    }
};

const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ userId: req.user.id });
        res.status(200).json({ message: "Watch history cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing watch history", error });
    }
};



const addUserHistory = async (req, res) => {
    const { mediaId } = req.params;
    const newHistory = new History({ userId: req.user.id, mediaId });

    await newHistory.save();
    res.status(201).json({ message: "History added", history: newHistory });
    
};

module.exports = { getUserHistory, addUserHistory, deleteHistoryItem, clearHistory };
