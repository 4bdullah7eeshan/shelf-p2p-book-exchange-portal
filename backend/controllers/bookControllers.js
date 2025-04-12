const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");

const getAllBooks = asyncHandler(async (req, res) => {
    const allBooks = await prismaClient.book.findMany({
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

    res.status(200).json(allBooks);
});

const createANewBook = asyncHandler(async (req, res) => {
    const newBookData = req.body;

    if (!newBookData.ownerId) {
        return res.status(400).json({ error: "Owner ID is required" });
    }

    const newBook = await prismaClient.book.create({
        data: {
            title: newBookData.title,
            author: newBookData.author,
            genre: newBookData.genre,
            city: newBookData.city,
            ownerId: newBookData.ownerId,
            status: 'AVAILABLE'
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
    const ownerId = parseInt(req.query.userId);

    const ownerBooks = await prismaClient.book.findMany({
        where: { ownerId },
        include: { owner: true }
    });

    res.json(ownerBooks);
});

const getRentedBooksOfASeeker = asyncHandler(async (req, res) => {
    const seekerId = parseInt(req.query.userId);

    const rentedBooks = await prismaClient.book.findMany({
        where: { 
            seekerId,
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