import express from "express";

import {
  addAuthor,
  getAuthors,
  removeAuthor,
  getAuthorsById,
  updateAuthor,
} from "../controller/author.controller.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploads.middleware.js";

const router = express.Router();

router.post("/register", upload, addAuthor);
router.delete("/remove", removeAuthor);
