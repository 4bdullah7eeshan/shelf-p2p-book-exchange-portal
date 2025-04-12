const { Router } = require("express");
const { getBooks } = require("../contexts/bookContexts");
const {
    createANewBook,
    getABookById,
    updateABook,
    deleteABook,
    getOwnerBooks,
    getRentedBooksOfASeeker,
} = require("../controllers/bookControllers");
const upload = require('../middlewares/upload');


const bookRouter = Router();

bookRouter.get("/", getBooks);

bookRouter.get("/owner", getOwnerBooks);
bookRouter.get("/rented", getRentedBooksOfASeeker);
bookRouter.get("/:bookId", getABookById);
bookRouter.post("/", upload.single('coverImage'), createANewBook);
bookRouter.put("/:bookId", updateABook);
bookRouter.delete("/:bookId", deleteABook);



module.exports = bookRouter;