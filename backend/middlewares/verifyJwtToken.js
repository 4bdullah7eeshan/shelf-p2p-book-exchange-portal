const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyJwtToken = asyncHandler(async (req, res, next) => {
    const token = req.token;
    try {
        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        
        req.user = decoded;
        next();
    } catch (err) {
        // Handle specific JWT errors
        const message = err.name === 'TokenExpiredError'
            ? 'Token expired'
            : 'Invalid token';
        
        res.status(403).json({ message });
    }
});

module.exports = {
    verifyJwtToken
};