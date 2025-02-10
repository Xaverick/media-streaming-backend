const express = require('express');
const { 
    getAllMedia, searchMedia, getMediaById, 
    uploadMedia, deleteMedia, updateMedia, 
    getCategories, getRecommendations 
} = require('../controllers/mediaController');

const { authenticateUser, requireAdmin, apiLimiter} = require('../middleware');
const catchAsync = require("../utils/CatchAsync.js");
const {upload} = require("../config/cloudinary.js");
const router = express.Router();


router.route('/')
    .get(apiLimiter, catchAsync(getAllMedia));
    // .get(apiLimiter, authenticateUser, catchAsync(getAllMedia));

router.route('/recommendations')
    .get(apiLimiter, authenticateUser, catchAsync(getRecommendations));

router.route('/search')
    .get(apiLimiter, catchAsync(searchMedia));

router.route('/categories')
    .get(apiLimiter, catchAsync(getCategories));

router.route('/:id')
    // .get(authenticateUser, catchAsync(getMediaById))
    .get(apiLimiter, catchAsync(getMediaById))
    .put(authenticateUser, requireAdmin, upload.single('file'), catchAsync(updateMedia))
    .delete(authenticateUser, requireAdmin, catchAsync(deleteMedia))

router.route('/upload')
    .post(authenticateUser, requireAdmin, upload.single('file'), catchAsync(uploadMedia));


module.exports = router;






/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Endpoints for managing media content on streaming service
 */

/**
 * @swagger
 * /api/media/:
 *   get:
 *     summary: Get all media
 *     description: Fetch all media with pagination.
 *     tags: [Media]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved media.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/media/search:
 *   get:
 *     summary: Search media
 *     description: Search media by title, category, or description.
 *     tags: [Media]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful search results.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/media/categories:
 *   get:
 *     summary: Get media categories
 *     description: Fetch all distinct media categories.
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: List of categories retrieved.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/media/recommendations:
 *   get:
 *     summary: Get personalized recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of recommended media
 */

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get media by ID
 *     description: Fetch a media item by its unique ID.
 *     tags: [Media]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details retrieved successfully.
 *       404:
 *         description: Media not found.
 *   put:
 *     summary: Update media (Admin only)
 *     description: Update media details.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Media updated successfully.
 *       400:
 *         description: Invalid request.
 *       403:
 *         description: Forbidden.
 *   delete:
 *     summary: Delete media (Admin only)
 *     description: Deletes a media item.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media deleted successfully.
 *       404:
 *         description: Media not found.
 */

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload media (Admin only)
 *     description: Upload a new media file. for tags please enter in this manner "[\"tag1\", \"tag2\"]"
 * 
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded successfully.
 *       400:
 *         description: No file uploaded.
 */

/**
//  * @swagger
//  * /watchlist:
//  *   post:
//  *     summary: Add media to watchlist
//  *     description: Allows users to bookmark media for later viewing.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               mediaId:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Media added to watchlist.
//  *       400:
//  *         description: Invalid request.
//  *   get:
//  *     summary: Get user's watchlist
//  *     description: Fetch all bookmarked media for the user.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of bookmarked media retrieved.
//  */

// /**
//  * @swagger
//  * /watch-progress:
//  *   post:
//  *     summary: Save watch progress
//  *     description: Saves where a user left off in a media file.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               mediaId:
//  *                 type: string
//  *               timestamp:
//  *                 type: integer
//  *     responses:
//  *       201:
//  *         description: Watch progress saved.
//  *   get:
//  *     summary: Get watch progress
//  *     description: Fetch the last watched timestamp for a media file.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: mediaId
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Watch progress retrieved.
//  */

// /**
//  * @swagger
//  * /recommendations:
//  *   get:
//  *     summary: Get recommended media
//  *     description: Provides media recommendations based on user history.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of recommended media retrieved.
//  */

// /**
//  * @swagger
//  * /bulk-upload:
//  *   post:
//  *     summary: Bulk upload media (Admin only)
//  *     description: Allows admins to upload multiple media files at once.
//  *     tags: [Media]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               files:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *     responses:
//  *       201:
//  *         description: Bulk media uploaded successfully.
//  */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
