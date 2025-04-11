const validateAuthFormat = (req, res, next) => {
    const authHeader = req.authHeader;

    if(!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid format"
        });
    }

    next();
}

module.exports = {
    validateAuthFormat,
}