const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
    // Verify token
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    // Check if user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};



const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: { message: 'Too many requests, please try again later.' },
});




module.exports = { authenticateUser, requireAdmin, apiLimiter };