import {
  addNewBook,
  deleteBook,
  updateExistingBook,
  searchBooks,
  getAllBooks,
  getBookById,
} from "../services/book.service.js";

import { validationResult } from "express-validator";

export const getBooksDashboard = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.render("books", { books });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

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

    const bookData = {
      title,
      author,
      genre,
      publicationYear,
      price,
      fileUrl,
      coverImage,
    };
    const book = await addNewBook(bookData);
    res.redirect("/dashboard/books");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const removeBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const deletedBook = await deleteBook(bookId);

    if (!deletedBook) {
      return res.status(500).send("Failed to delete book");
    }
    res.redirect("/dashboard/books");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const editBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await getBookById(bookId);
    res.render("editBook", { book });
  } catch (e) {
    res.status(500).send(e.message);
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
      res.status(404).send("Book not found");
    }
    res.redirect("/dashboard/books");
  } catch (error) {
    res.status(500).send("Failed to update book");
  }
};
export const searchBooksDashboard = async (req, res) => {
  try {
    const books = await searchBooks(req.query.searchQuery);
    res.render("books", { books });
  } catch (error) {
    res.status(500).send("Error searching books");
  }
};

export const findBooks = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { searchQuery } = req.query;

    const books = await searchBooks(searchQuery);

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
