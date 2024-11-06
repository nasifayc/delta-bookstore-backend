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

  if (author.profilePic) {
    console.log(author);
    fs.unlink(path.resolve(author.profilePic), (err) => {
      if (err)
        throw new Error(`Failed to delete book cover image: ${err.message}`);
    });
  }

  await AuthorModel.findByIdAndDelete(authorId);
};

// export const deleteAuthor = async (authorId) => {
//   const author = await AuthorModel.findById(authorId);  // Find the author by ID
//   if (!author) {
//     throw new Error("Author not found");  // If not found, throw an error
//   }

//   // Check if the author has a profile image and delete it
//   if (author.profilePic) {  // Assuming the profile image is stored in profilePic
//     const imagePath = path.resolve(author.profilePic);  // Get the path of the image
//     try {
//       // Delete the file and wait for it to complete before proceeding
//       await fs.promises.unlink(imagePath);
//     } catch (err) {
//       throw new Error(`Failed to delete author profile image: ${err.message}`);
//     }
//   }

//   // Delete the author from the database
//   await AuthorModel.findByIdAndDelete(authorId);
// };

export const searchAuthors = async (searchTerm) => {
  const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
  return await AuthorModel.find({ name: { $regex: regex } });
};
