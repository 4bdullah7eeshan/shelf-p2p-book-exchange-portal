const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");

const getAllBooks = asyncHandler(async (req, res) => {
    const allBooks = prismaClient.book.findMany();

    res.status(200).json(allBooks);
});

const createANewBook = asyncHandler(async (req, res) => {
    const newBookData = req.body;

    const newBook = await prismaClient.book.create({
        data: {
            ...newBookData,
            ownerId: req.user.id,
            status: 'AVAILABLE',
        }
    });

    res.status(200).json(newBook);
});

const getABookById = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId;

    const book = await prismaClient.book.findUnique({
        where: {
            id: bookId,
        },
    });

    res.status(200).json(book);
});

const updateABook = asyncHandler(async (req, res) => {
    const updatedBookId = req.params.bookId;
    const updatedBookData = req.body;

    const updatedBook = await prismaClient.book.update({
        where: {
            id: updatedBookId,
        },
        data: updatedBookData,
    });

    res.status(200).json(updatedBook);
});

const deleteABook = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId;

    const deletedBook = await prismaClient.book.delete({
        where: {
            id: bookId,
        },
    });

    res.status(200).json(deletedBook);
});

const getOwnerBooks = asyncHandler(async (req, res) => {
    const ownerBooks = await prismaClient.book.findMany({
        where: { ownerId: req.user.id },
        include: { owner: true }
    });

    res.json(ownerBooks);
});

const getRentedBooksOfASeeker = asyncHandler(async (req, res) => {
    const rentedBooks = await prismaClient.book.findMany({
        where: { 
            seekerId: req.user.id,
            status: 'RENTED',
        },
        include: { 
            owner: {
                select: {
                    name: true,
                    email: true,
                    mobile: true
                }
            }
        }
    });

    res.json(rentedBooks);
});

module.exports = {
    getAllBooks,
    createANewBook,
    getABookById,
    updateABook,
    deleteABook,
    getOwnerBooks,
    getRentedBooksOfASeeker,
}