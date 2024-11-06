import db from "../database/mongoose.js";

const { Schema } = db;

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    required: true,
  },
});

const AuthorModel = db.model("Author", authorSchema);

export default AuthorModel;
