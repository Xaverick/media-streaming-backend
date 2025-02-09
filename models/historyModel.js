const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);
