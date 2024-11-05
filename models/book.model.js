import db from "../database/mongoose.js";

const { Schema } = db;

const bookSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  author: { type: String, required: true, default: "Unknown" },
  genre: { type: String, default: "Not specified" },
  publicationYear: { type: Number, required: true },
  price: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  coverImage: { type: String, required: true },
});

const BookModel = db.model("Book", bookSchema);
export default BookModel;
