const express = require("express");
const { authenticateUser } = require("../middleware");
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} = require("../controllers/watchlistController");
const catchAsync = require("../utils/CatchAsync.js");

const router = express.Router();

router.route("/").get(authenticateUser, catchAsync(getWatchlist));
router
  .route("/:id")
  .post(authenticateUser, catchAsync(addToWatchlist))
  .delete(authenticateUser, catchAsync(removeFromWatchlist));

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: Manage user watchlists
 */

/**
 * @swagger
 * /api//watchlist:
 *   get:
 *     summary: Get user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's watchlist
 */

/**
 * @swagger
 * /api/watchlist/{id}:
 *   post:
 *     summary: Add media to watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID to add to watchlist
 *     responses:
 *       200:
 *         description: Added to watchlist
 *       400:
 *         description: Already in watchlist
 *   delete:
 *     summary: Remove media from watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID to remove from watchlist
 *     responses:
 *       200:
 *         description: Removed from watchlist
 */
