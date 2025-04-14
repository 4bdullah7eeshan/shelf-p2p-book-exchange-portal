const asyncHandler = require("express-async-handler");
const { prismaClient } = require("../prisma/client");
const { cloudinary } = require('../config/cloudinary');

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
    let coverUrl;
    const newBookData = req.body;

    if (!newBookData.ownerId) {
        return res.status(400).json({ error: "Owner ID is required" });
    }

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        coverUrl = result.secure_url;
    }

    const newBook = await prismaClient.book.create({
        data: {
            title: newBookData.title,
            author: newBookData.author,
            genre: newBookData.genre,
            city: newBookData.city,
            ownerId: parseInt(newBookData.ownerId),
            status: 'AVAILABLE',
            coverUrl: coverUrl,
        },
        include: {
            owner: {
                select: {
                    name: true,
                    email: true,
                    mobile: true,
                },
            },
        },
    });

    const io = req.app.get('io');

    if (io) {
        io.except(`user_${newBook.ownerId}`).emit('new-book', newBook);
    }

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
    const bookId = parseInt(req.params.bookId);
    const { title, author, genre, city, status } = req.body;

    const updatedBook = await prismaClient.book.update({
        where: { id: bookId },
        data: { title, author, genre, city, status }
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