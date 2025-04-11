const { checkAuthHeader } = require("./checkAuthHeader");
const { validateAuthFormat } = require("./validateAuthFormat");
const { validateTokenPresence } = require("./validateJwtTokenPresence");
const { extractJwtToken } = require('./extractJwtToken');
const { verifyJwtToken } = require('./verifyJwtToken');

const jwtAuthChain = [
    checkAuthHeader,
    validateAuthFormat,
    validateTokenPresence,
    extractJwtToken,
    verifyJwtToken
];

module.exports = jwtAuthChain;