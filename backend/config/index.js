const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
}