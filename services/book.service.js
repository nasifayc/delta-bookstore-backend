import UserModel from "../models/user.model.js";
import BookModel from "../models/book.model.js";
import AuthorModel from "../models/author.model.js";

import fs from "fs";
import path from "path";

export const getAllBooks = async () => {
  return await BookModel.find();
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
  // Create the base query to match the title and genre directly
  const query = [
    { title: { $regex: searchQuery, $options: "i" } },
    { genre: { $regex: searchQuery, $options: "i" } },
  ];

  // Search for authors whose name matches the query
  const authors = await AuthorModel.find({
    name: { $regex: searchQuery, $options: "i" },
  }).select("_id");

  if (authors.length > 0) {
    const authorIds = authors.map((author) => author._id);
    // Add an additional condition for matching authors in the $or array
    query.push({ author: { $in: authorIds } });
  }

  // Search the BookModel for any books that match title, genre, or author
  const books = await BookModel.find({ $or: query });

  return books;
};

export const updateExistingBook = async (bookId, updatedBookData) => {
  return await BookModel.findByIdAndUpdate(bookId, updatedBookData, {
    new: true,
  });
};
export const addBookToWishlist = async (userId, bookId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlistBooks: bookId } },
    { new: true }
  ).populate("wishlistBooks");
};

export const removeBookFromWishlist = async (userId, bookId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { wishlistBooks: bookId } },
    { new: true }
  ).populate("wishlistBooks");
};

export const addBookToPurchased = async (userId, bookId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  user.wishlistBooks = user.wishlistBooks.filter(
    (id) => id.toString() !== bookId
  );
  if (!user.purchasedBooks.includes(bookId)) {
    user.purchasedBooks.push(bookId);
  }
  return await user.save();
};

export const addReview = async (userId, bookId, rating, review) => {
  const book = await BookModel.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  book.reviews.push({ userId, comment, rating });

  const totalRatings = book.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  book.rating = totalRatings / book.reviews.length;

  return await book.save();
};
