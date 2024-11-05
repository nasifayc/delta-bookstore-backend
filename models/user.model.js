import db from "../database/mongoose.js";
import bcrypt from "bcryptjs";

const { Schema } = db;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // Array to store IDs of books in the wishlist
  wishlistBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book", // Reference the Book model
    },
  ],
  // Array to store IDs of purchased books
  purchasedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book", // Reference the Book model
    },
  ],
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const UserModel = db.model("User", userSchema);
export default UserModel;
