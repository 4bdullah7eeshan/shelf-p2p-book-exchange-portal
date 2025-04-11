const { Router } = require("express");
const {
    createANewUser,
} = require("../controllers/userControllers");

const userRouter = Router();

userRouter.post("/", createANewUser);

module.exports = userRouter;