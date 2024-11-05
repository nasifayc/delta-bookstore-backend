import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  purchaseBook,
} from "../controller/user.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/wishlist/:bookId", verifyToken, addToWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);

router.post("/purchase/:bookId", verifyToken, purchaseBook);

export default router;
