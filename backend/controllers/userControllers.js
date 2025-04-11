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

    const result = await prismaClient.$transaction(async (prisma) => {
        const profile = await prisma.profile.create({
            data: {
                name: newUserData.name,
                mobile: newUserData.mobile,
                role: newUserData.role,
            },
        });

        const user = await prisma.user.create({
            data: {
                email: newUserData.email,
                password: hashedPassword,
                profileId: profile.id
            },
            include: { profile: true }
        });

        await prisma.profile.update({
            where: { id: profile.id },
            data: { userId: user.id }
        });

        return user;
    });

    const responseData = {
        id: result.id,
        email: result.email,
        profile: {
            name: result.profile.name,
            mobile: result.profile.mobile,
            role: result.profile.role
        }
    };

    res.status(201).json(responseData);
});

module.exports = {
    createANewUser,
}