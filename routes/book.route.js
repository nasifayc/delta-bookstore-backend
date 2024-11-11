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
  "/dashboard/addbook",
  verifyToken,
  authorizeRoles("super_admin", "author"),
  bookUpload,
  addBook
);

router.delete(
  "/dashboard/removeBook/:bookId",
  verifyToken,
  authorizeRoles("super_admin"),
  removeBook
);
router.patch(
  "/dashboard/updatebook/:bookId",
  authorizeRoles("super_admin"),
  updateBook
);
router.get("/dashboard/all", getBooks);
router.get("/all", getBooks);
router.get("/dashboard/search", findBooks);

export default router;
