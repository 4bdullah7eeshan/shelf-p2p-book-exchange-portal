const { Router } = require("express");
const {
    signInAUser,
    signOutAUser,
} = require("../controllers/sessionControllers");

const sessionRouter = Router();

sessionRouter.post("/", signInAUser);
sessionRouter.delete("/", signOutAUser); // Not used

module.exports = sessionRouter;