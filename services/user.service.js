import UserModel from "../models/user.model.js";
import BookModel from "../models/book.model.js";

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
  // console.log(bookId);
  // console.log(book);
  if (!book) {
    throw new Error("Book not found");
  }

  book.reviews.push({ userId, review, rating });

  const totalRatings = book.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  book.rating = totalRatings / book.reviews.length;

  return await book.save();
};
