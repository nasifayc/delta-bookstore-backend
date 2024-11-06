import express from "express";

import {
  addAuthor,
  allAuthors,
  removeAuthor,
  getAuthor,
  updateAuthorData,
  findAuthor,
} from "../controller/author.controller.js";

import uploadAuthorProfilePic from "../middlewares/author.middleware.js";

const router = express.Router();

router.post("/register/", uploadAuthorProfilePic, addAuthor);
router.delete("/remove/:authorId", removeAuthor);
router.get("/search", findAuthor);
router.get("/all", allAuthors);
router.get("/getAuthor/:authorId", getAuthor);
router.put("/updateAuthor/:authorId", updateAuthorData);

export default router;
