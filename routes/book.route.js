import express from "express";
import {
  addBook,
  removeBook,
  updateBook,
  findBooks,
  getBooks,
} from "../controller/book.controller.js";

import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import bookUpload from "../middlewares/book.middleware.js";

const router = express.Router();

router.post(
  "/addbook",
  verifyToken,
  authorizeRoles("super_admin", "author"),
  bookUpload,
  addBook
);

router.delete(
  "/removeBook/:bookId",
  verifyToken,
  authorizeRoles("super_admin"),
  removeBook
);
router.patch("/updatebook/:bookId", authorizeRoles("super_admin"), updateBook);
router.get("/all", getBooks);
router.get("/search", findBooks);

export default router;
