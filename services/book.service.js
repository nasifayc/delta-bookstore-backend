import UserModel from "../models/user.model.js";
import BookModel from "../models/book.model.js";

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
  const book = BookModel.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.fileUrl) {
    fs.unlink(path.resolve(book.fileUrl), (err) => {
      if (err)
        throw new Error(`Failed to delete book cover image: ${err.message}`);
    });
  }

  if (book.coverImage) {
    fs.unlink(path.resolve(book.coverImage), (err) => {
      if (err) throw new Error(`Failed to delete book file: ${err.message}`);
    });
  }

  if (book.audioFiles && book.audioFiles.length > 0) {
    for (const audioPath of book.audioFiles) {
      fs.unlink(path.resolve(audioPath), (err) => {
        if (err) {
          console.error(`Failed to delete audio file: ${err.message}`);
          throw new Error(`Failed to delete audio file: ${err.message}`);
        }
      });
    }
  }
  return await BookModel.findByIdAndDelete(bookId);
};

export const searchBooks = async ({ title, author, genre }) => {
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (author) {
    query.author = {
      $regex: author,
      $option: "i",
    };
  }

  if (genre) {
    query.genre = { $regex: genre, $options: "i" };
  }

  return await BookModel.find(query);
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
