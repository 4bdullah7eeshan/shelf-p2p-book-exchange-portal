const extractJwtToken = (req, res, next) => {
    const token = req.authParts[1];
    req.token = token;
    next();
};

module.exports = {
    extractJwtToken,
}