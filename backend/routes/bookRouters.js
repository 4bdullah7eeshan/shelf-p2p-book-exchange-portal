const { Router } = require("express");
const { getBooks } = require("../contexts/bookContexts");
const {
    createANewBook,
    getABookById,
    updateABook,
    deleteABook,
} = require("../controllers/bookControllers");
const jwtAuthChain = require("../middlewares/jwtAuthChain");

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:bookId", getABookById);
bookRouter.post("/", jwtAuthChain, createANewBook);
bookRouter.put("/:bookId", jwtAuthChain, updateABook);
bookRouter.delete("/:bookId", jwtAuthChain, deleteABook);


module.exports = bookRouter;