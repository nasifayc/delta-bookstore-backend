import db from "../database/mongoose.js";

const { Schema } = db;

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  review: { type: String, default: null },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

const bookSchema = new Schema({
  title: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  genre: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  price: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  coverImage: { type: String, required: true },
  audioFiles: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
});

const BookModel = db.model("Book", bookSchema);
export default BookModel;
