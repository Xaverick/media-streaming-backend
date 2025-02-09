const express = require('express');
const { getUserHistory, addToHistory, deleteHistoryItem, clearHistory } = require('../controllers/historyController');
const { authenticateUser } = require('../middleware');
const catchAsync = require('../utils/CatchAsync.js');
const router = express.Router();


router.route('/')
    .get(authenticateUser, catchAsync(getUserHistory))
    .delete(authenticateUser, catchAsync(clearHistory)); // route for clearing history


router.route('/:mediaId')
    .delete(authenticateUser, catchAsync(deleteHistoryItem)); // route for deleting a specific item

module.exports = router;
