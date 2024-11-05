import {
  addNewBook,
  deleteBook,
  updateExistingBook,
  searchBooks,
  getAllBooks,
  addBookToWishlist,
  removeBookFromWishlist,
  addBookToPurchased,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const bookData = req.body;
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
