const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { prismaClient } = require("../prisma/client");
const { JWT_SECRET } = require("../config");

const signInAUser = asyncHandler(async (req, res) => {
    const userProfileData = req.body;

    const userProfileExists = await prismaClient.profile.findUnique({
        where: {
            email: userProfileData.email,
        },
    });

    if (!userProfileExists) {
        throw new Error ("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(userProfileData.password, userProfileExists.password);

    if (!passwordMatch) {
        throw new Error ("Invalid password");
    }

    try {
        const token = jwt.sign({ userProfileExists }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            token,
            user: user,
            expiresIn: 3600
        });
    } catch (err) {
        console.error("Jwt error", err);
        res.status(500).json({ message: "Authentication failed" });
    }

});
