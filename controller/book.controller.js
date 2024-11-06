import {
  addNewBook,
  deleteBook,
  updateExistingBook,
  searchBooks,
  getAllBooks,
  addBookToWishlist,
  removeBookFromWishlist,
  addBookToPurchased,
  addReview,
} from "../services/book.service.js";

import { validationResult } from "express-validator";

export const getBooks = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addBook = async (req, res) => {
  console.log("------------------reached here ----------------");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, author, genre, publicationYear, price } = req.body;
    // Check if both files are provided
    if (!req.files || !req.files["pdf"] || !req.files["coverImage"]) {
      return res.status(400).json({
        error: "Both the book PDF and cover image are required.",
      });
    }

    // Access files
    const fileUrl = req.files["pdf"][0]?.path; // The file path for the PDF
    const coverImage = req.files["coverImage"][0]?.path; // The file path for the cover image

    if (!fileUrl || !coverImage) {
      return res.status(400).json({
        error: "Failed to upload PDF or cover image, please try again.",
      });
    }
    const audioFiles = req.files["audio"]
      ? req.files["audio"].map((file) => file.path)
      : [];

    const bookData = {
      title,
      author,
      genre,
      publicationYear,
      price,
      fileUrl,
      coverImage,
      audioFiles,
    };
    const book = await addNewBook(bookData);
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeBook = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const bookId = req.params.bookId;
    const deletedBook = await deleteBook(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bookId = req.params.bookId;
    const updateData = req.body;
    const updatedBook = await updateExistingBook(bookId, updateData);

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findBooks = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, author, genre } = req.query;
    const books = await searchBooks({ title, author, genre });

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const updatedUser = await addBookToWishlist(userId, bookId);

    res.status(200).json({ message: "Book added to wishlist", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const updatedUser = await removeBookFromWishlist(userId, bookId);

    res
      .status(200)
      .json({ message: "Book removed from wishlist", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove book from wishlist" });
  }
};

export const purchaseBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const updatedUser = await addBookToPurchased(userId, bookId);

    res
      .status(200)
      .json({ message: "Book purchased successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete purchase" });
  }
};

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const { rating, review } = req.body;
    const updatedUser = await addReview(userId, bookId, rating, review);

    if (!updatedUser) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add review", details: error.message });
  }
};
