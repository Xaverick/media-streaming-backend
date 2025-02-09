const express = require('express');
const { getUserHistory, addToHistory } = require('../controllers/historyController');
const { authenticateUser } = require('../middleware/authMiddleware');
const catchAsync = require('../utils/CatchAsync.js');
const router = express.Router();

router.route('/')
    .get(authenticateUser, catchAsync(getUserHistory));

router.route('/:mediaId')
    .post(authenticateUser, catchAsync(addToHistory));

module.exports = router;
