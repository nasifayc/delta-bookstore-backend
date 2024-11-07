import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  purchaseBook,
  createReview,
} from "../controller/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/wishlist/:bookId", verifyToken, addToWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);
router.post("/checkout/:bookId", verifyToken, purchaseBook);
router.post("/reviewbooks/:bookId", verifyToken, createReview);

export default router;
