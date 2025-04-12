const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");
const bcryptjs = require("bcryptjs");

const createANewUser = asyncHandler(async (req, res) => {
    const newUserData = req.body;

    const existingUser = await prismaClient.user.findUnique({
        where: {
            email: newUserData.email,
        },
    });

    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(newUserData.password, 10);

    const newUser = await prismaClient.user.create({
        data: {
            email: newUserData.email,
            password: hashedPassword,
            name: newUserData.name,
            mobile: newUserData.mobile,
            role: newUserData.role,
        },
        select: {
            id: true,
            email: true,
            name: true,
            mobile: true,
            role: true
        }
    });

    res.status(201).json(newUser);
});

module.exports = {
    createANewUser,
}