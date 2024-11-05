import UserModel from "../models/user.model.js";

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
