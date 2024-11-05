import {
  addBookToWishlist,
  removeBookFromWishlist,
  addBookToPurchased,
} from "../services/user.service.js";

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
