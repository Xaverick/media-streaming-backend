const express = require('express');
const { signup, login } = require('../controllers/authController');
const {apiLimiter} = require('../middleware');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');

router.route('/signup').post(apiLimiter, CatchAsync(signup));
router.route('/login').post(apiLimiter, CatchAsync(login))

module.exports = router;
