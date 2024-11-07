import {
  addBookToWishlist,
  removeBookFromWishlist,
  addBookToPurchased,
  addReview,
} from "../services/user.service.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;

    console.log(userId);
    const updatedUser = await addBookToWishlist(userId, bookId);
    console.log(updatedUser);

    res.status(200).json({ message: "Book added to wishlist", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
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
    if (req.transactionData) {
      const userId = req.user._id;
      const bookId = req.params.bookId;

      const user = await addBookToPurchased(userId, bookId);
      res.status(200).json({
        success: true,
        message: "Transaction completed successfully",
        data: req.transactionData,
        user,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to initialize transaction",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    console.log(bookId);
    const { rating, review } = req.body;
    const updatedUser = await addReview(userId, bookId, rating, review);

    if (!updatedUser) {
      res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Review added successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add review", details: error.message });
  }
};
