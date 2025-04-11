const checkAuthHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: 'Missing Authorization Header',
        });
    }

    req.authHeader = authHeader;
    next();
}

module.exports = {
    checkAuthHeader,
}