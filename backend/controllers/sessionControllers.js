const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { prismaClient } = require("../prisma/client");

const signInAUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile
    });

});


const signOutAUser = asyncHandler(async (req, res) => {
    // handler later

});

module.exports = {
    signInAUser,
    signOutAUser,
}
