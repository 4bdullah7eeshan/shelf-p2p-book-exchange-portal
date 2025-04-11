const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");

const getAllBooks = asyncHandler(async (req, res) => {
    const allBooks = prismaClient.book.findMany();

    res.status(200).json(allBooks);
});

module.exports = {
    getAllBooks,
}