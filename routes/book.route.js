import express from "express";
import {
  addBook,
  removeBook,
  updateBook,
  findBooks,
  getBooks,
} from "../controller/book.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import bookUpload from "../middlewares/book.middleware.js";

const router = express.Router();

router.post("/addbook", bookUpload, addBook);
router.delete("/removeBook/:bookId", removeBook);
router.patch("/updatebook/:bookId", updateBook);
router.get("/all", getBooks);
router.get("/search", findBooks);

export default router;
