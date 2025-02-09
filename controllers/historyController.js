const History = require('../models/History');

// Get user watch history
const getUserHistory = async (req, res) => {
    const history = await History.find({ userId: req.user.id }).populate('mediaId');
    res.status(200).json(history);
    
};

// Add media to user watch history
const addUserHistory = async (req, res) => {
    const { mediaId } = req.params;
    const newHistory = new History({ userId: req.user.id, mediaId });

    await newHistory.save();
    res.status(201).json({ message: "History added", history: newHistory });
    
};

module.exports = { getUserHistory, addUserHistory };
