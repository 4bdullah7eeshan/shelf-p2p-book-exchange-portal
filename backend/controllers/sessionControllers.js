const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { prismaClient } = require("../prisma/client");
const { JWT_SECRET } = require("../config");

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

    // try {
    //     const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
    //     res.status(200).json({
    //         token,
    //         user: user,
    //         expiresIn: 3600
    //     });
    // } catch (err) {
    //     console.error("Jwt error", err);
    //     res.status(500).json({ message: "Authentication failed" });
    // }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile
    };

    res.status(200).json({
        token,
        user: userData,
        expiresIn: 3600
    });

});


const signOutAUser = asyncHandler(async (req, res) => {
    // handler later

});

module.exports = {
    signInAUser,
    signOutAUser,
}
