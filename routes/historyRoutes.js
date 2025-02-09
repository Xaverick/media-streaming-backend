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





/**
 * @swagger
 * tags:
 *   name: History
 *   description: Endpoints for managing user watch history on streaming service
 */

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user watch history
 *     description: Retrieve the watch history of the authenticated user.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved watch history.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 * 
 *   delete:
 *     summary: Clear watch history
 *     description: Delete all watch history entries for the authenticated user.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watch history cleared successfully.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/history/{mediaId}:
 *   delete:
 *     summary: Delete specific history item
 *     description: Remove a specific media entry from the user's watch history.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the media to be removed from history.
 *     responses:
 *       200:
 *         description: History item deleted successfully.
 *       400:
 *         description: Invalid media ID.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 * 
 *   post:
 *     summary: Add media to user watch history
 *     description: Adds a media item to the user's watch history.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the media to be added to history.
 *     responses:
 *       201:
 *         description: History added successfully.
 *       400:
 *         description: Invalid request.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

