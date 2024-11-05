import db from "../database/mongoose.js";

const { Schema } = db;

const bookSchema = new Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String },
  publicationYear: { type: Number, required: true },
  price: { type: Number, required: true },
  fileUrl: { type: String, required: true },
});

const BookModel = db.model("book", bookSchema);
export default BookModel;
