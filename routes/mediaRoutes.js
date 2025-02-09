const express = require('express');
const { 
    getAllMedia, searchMedia, getMediaById, 
    uploadMedia, deleteMedia, updateMedia, 
    getCategories 
} = require('../controllers/mediaController');

const { authenticateUser, requireAdmin, apiLimiter} = require('../middleware');
const catchAsync = require("../utils/CatchAsync.js");
const {upload} = require("../config/cloudinary.js");
const router = express.Router();


router.route('/')
    .get(apiLimiter, authenticateUser, catchAsync(getAllMedia));

router.route('/search')
    .get(apiLimiter, authenticateUser, catchAsync(searchMedia));

router.route('/categories')
    .get(apiLimiter, authenticateUser, catchAsync(getCategories));

router.route('/:id')
    .get(authenticateUser, catchAsync(getMediaById))
    .put(authenticateUser, requireAdmin, upload.single('file'), catchAsync(updateMedia))
    .delete(authenticateUser, requireAdmin, catchAsync(deleteMedia))

router.route('/upload')
    .post(authenticateUser, requireAdmin, upload.single('file'), catchAsync(uploadMedia));


module.exports = router;
