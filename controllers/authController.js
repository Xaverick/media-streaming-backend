const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ExpressError = require('../utils/ExpressError');


// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// User Signup
exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    if(!name || !email || !password) {
        throw new ExpressError("All fields are required", 400);
    }
    let user = await User.findOne({ email });
    if (user) throw new ExpressError("User already exists", 400);

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();

    res.status(201).json({ token: generateToken(user), user: { id: user._id, name, email, role: user.role } });
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
        throw new ExpressError("All fields are required", 400);
    }
    const user = await User.findOne({email});
    if(!user) {
        throw new ExpressError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ExpressError("Invalid credentials", 400);

    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email, role: user.role } });
    
};
