import {
  registerAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
} from "../services/author.service.js";

export const allAuthors = async (req, res) => {
  try {
    const authors = await getAuthors();
    res.status(200).json({ authors });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await getAuthorById(authorId);
    res.status(200).json({ author });
  } catch (e) {
    res.status(404).json({ error: "Author not found" });
  }
};

export const updateAuthorData = async (req, res) => {
  try {
    const authorId = req.params.id;
    const updatedAuthorData = {
      ...req.body,
      profilePic: req.file?.profilePic?.[0]?.path || "",
    };

    const updatedAuthor = await updateAuthor(authorId, updatedAuthorData);
    res
      .status(200)
      .json({ message: "Author updated successfully", updatedAuthor });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const addAuthor = async (req, res) => {
  try {
    const authorData = {
      ...req.body,
      profilePic: req.file?.profilePic?.[0]?.path || "",
    };

    const author = await registerAuthor(authorData);
    res.status(201).json({ message: "Author registered successfully", author });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const removeAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    await deleteAuthor(authorId);

    res.status(200).json({ message: "Author deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const findAuthor = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const author = await searchAuthors(searchTerm);
    res.status(200).json({ author });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
