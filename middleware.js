const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const ExpressError = require('./utils/ExpressError');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) throw new ExpressError('No token, authorization denied', 401);
    // Verify token
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ExpressError('Token is not valid', 401);
    }
};

const requireAdmin = (req, res, next) => {
    // Check if user is an admin
    if (req.user.role !== 'admin') {
        throw new ExpressError('Access denied', 403);
    }
    next();
};



const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: { message: 'Too many requests, please try again later.' },
});




module.exports = { authenticateUser, requireAdmin, apiLimiter };