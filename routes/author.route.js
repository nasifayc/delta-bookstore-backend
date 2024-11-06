import express from "express";

import {
  addAuthor,
  allAuthors,
  removeAuthor,
  getAuthor,
  updateAuthorData,
  findAuthor,
} from "../controller/author.controller.js";

import upload from "../middlewares/uploads.middleware.js";

const router = express.Router();

router.post("/register", upload, addAuthor);
router.delete("/remove", removeAuthor);
router.get("/search", findAuthor);
router.get("/all", allAuthors);
router.get("/getAuthor/:authorId", getAuthor);
router.put("/updateAuthor/:authorId", updateAuthorData);

export default router;
