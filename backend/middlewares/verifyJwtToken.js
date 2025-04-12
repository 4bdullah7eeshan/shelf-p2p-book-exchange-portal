const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyJwtToken = asyncHandler(async (req, res, next) => {
    const token = req.token;
    try {
        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        
        const user = await prismaClient.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        if (!user) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
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