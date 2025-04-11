const { Router } = require("express");
const { getBooks } = require("../contexts/bookContexts");

const bookRouter = Router();

bookRouter.get("/", getBooks);


module.exports = bookRouter;