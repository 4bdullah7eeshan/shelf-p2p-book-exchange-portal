const { getAllBooks } = require("../controllers/bookControllers");

const getBooks = (req, res) => {
    if (req.params.userId) {
        return 
    } else {
        return getAllBooks(req, res);
    }
};

module.exports = {
    getBooks,
}