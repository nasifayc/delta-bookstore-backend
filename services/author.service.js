import AuthorModel from "../models/author.model.js";
import fs from "fs";
import path from "path";

export const registerAuthor = async (authorData) => {
  const author = new AuthorModel(authorData);
  return await author.save();
};

export const getAuthors = async () => {
  return await AuthorModel.find();
};

export const getAuthorById = async (authorId) => {
  return await AuthorModel.findById(authorId);
};

export const updateAuthor = async (authorId, updatedAuthorData) => {
  return await AuthorModel.findByIdAndUpdate(authorId, updatedAuthorData, {
    new: true,
  });
};

export const deleteAuthor = async (authorId) => {
  const author = await AuthorModel.findById(authorId);
  if (!author) {
    throw new Error("Author not found");
  }

  if (author.profileUrl) {
    fs.unlink(path.resolve(author.profileUrl), (err) => {
      if (err)
        throw new Error(`Failed to delete book cover image: ${err.message}`);
    });
  }

  await AuthorModel.findByIdAndDelete(authorId);
};

export const searchAuthors = async (searchTerm) => {
  const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
  return await AuthorModel.find({ name: { $regex: regex } });
};
