const express = require("express");
const { authenticateUser } = require("../middleware");
const {
  saveWatchProgress,
  getWatchProgress,
} = require("../controllers/watchProgressController");

const catchAsync = require("../utils/CatchAsync.js");
const router = express.Router();


router
  .route("/:id")
  .get(authenticateUser, catchAsync(getWatchProgress))
  .post(authenticateUser, catchAsync(saveWatchProgress));

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: Watch Progress
 *   description: Save and retrieve user watch progress
 */

/**
 * @swagger
 * /api/progress/{id}:
 *   post:
 *     summary: Save watch progress
 *     tags: [Watch Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timestamp:
 *                 type: number
 *                 description: Last watched timestamp in seconds
 *     responses:
 *       200:
 *         description: Progress saved successfully
 *
 *   get:
 *     summary: Get watch progress
 *     tags: [Watch Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Returns last watched timestamp
 */
