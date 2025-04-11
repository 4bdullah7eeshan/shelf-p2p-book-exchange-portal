const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");

const createANewUser = asyncHandler(async (req, res) => {
    const newUserData = req.body;

    const newUser = await prismaClient.user.create({
        data: {
            profile: {
                create: {
                    data: newUserData,
                },
            },
        },
        include: {
            profile: true,
        },
    });

    res.status(200).json(newUser);
});

module.exports = {
    createANewUser,
}