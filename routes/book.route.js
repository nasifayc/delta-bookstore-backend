import express from "express";
import {
  addBook,
  removeBook,
  updateBook,
  findBooks,
  getBooks,
  addToWishlist,
  removeFromWishlist,
  purchaseBook,
  createReview,
} from "../controller/book.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import bookUpload from "../middlewares/book.middleware.js";

const router = express.Router();

router.post("/addbook", bookUpload, addBook);
router.delete("/books/:bookId", removeBook);
router.put("/books/:bookId", updateBook);
router.get("/books/all", verifyToken, getBooks);
router.get("/books/search", findBooks);
router.post("/wishlist/:bookId", verifyToken, addToWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);
router.post("/purchase/:bookId", verifyToken, purchaseBook);
router.post("/books/:bookID/reviews", verifyToken, createReview);

export default router;
