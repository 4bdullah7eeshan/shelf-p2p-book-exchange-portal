const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");

const createANewUser = asyncHandler(async (req, res) => {
    const newUserData = req.body;

    const newUser = await prismaClient.user.create({
        data: newUserData,
    });

    res.status(200).json(newUser);
});

module.exports = {
    createANewUser,
}