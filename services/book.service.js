import BookModel from "../models/book.model.js";

import fs from "fs";
import path from "path";

export const getAllBooks = async () => {
  return await BookModel.find();
};
export const getBookById = async (bookId) => {
  return await BookModel.findById(bookId);
};
export const addNewBook = async (bookData) => {
  const book = new BookModel(bookData);
  return await book.save();
};

export const deleteBook = async (bookId) => {
  const book = await BookModel.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  try {
    if (book.fileUrl) {
      await fs.promises.unlink(path.resolve(book.fileUrl));
    }

    if (book.coverImage) {
      await fs.promises.unlink(path.resolve(book.coverImage));
    }

    if (book.audioFiles && book.audioFiles.length > 0) {
      for (const audioPath of book.audioFiles) {
        await fs.promises.unlink(path.resolve(audioPath));
      }
    }

    return await BookModel.findByIdAndDelete(bookId);
  } catch (error) {
    console.error(`Failed to delete files: ${error.message}`);
    throw new Error(`Failed to delete files: ${error.message}`);
  }
};

export const searchBooks = async (searchQuery) => {
  const query = [
    { title: { $regex: searchQuery, $options: "i" } },
    { genre: { $regex: searchQuery, $options: "i" } },
  ];

  const books = await BookModel.find({ $or: query });

  return books;
};

export const updateExistingBook = async (bookId, updatedBookData) => {
  return await BookModel.findByIdAndUpdate(bookId, updatedBookData, {
    new: true,
  });
};
