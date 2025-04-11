const validateTokenPresence = (req, res, next) => {
    const authHeader = req.authHeader;
    try {
        // Split header and check for exactly 2 parts
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || !parts[1]) {
            throw new Error();
        }
        req.authPart = parts;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authorization header requires 'Bearer <token>' format"
        });
    }
};

module.exports = {
    validateTokenPresence,
}