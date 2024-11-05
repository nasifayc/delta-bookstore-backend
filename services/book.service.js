import UserModel from "../models/user.model.js";
import BookModel from "../models/book.model.js";

export const getAllBooks = async () => {
  return await BookModel.find();
};

export const addNewBook = async (bookData) => {
  const book = new BookModel(bookData);
  return await book.save();
};

export const deleteBook = async (bookId) => {
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
