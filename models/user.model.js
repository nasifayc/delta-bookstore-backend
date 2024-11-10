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
  profileImage: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["super_admin", "author", "user"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  wishlistBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  purchasedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
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

userSchema.methods.setOtp = function (otp) {
  this.otp = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
};

userSchema.methods.verifyOtp = function (enteredOtp) {
  const isOtpValid = this.otp === enteredOtp && Date.now() < this.otpExpires;
  if (isOtpValid) {
    this.isVerified = true;
    this.otp = undefined;
    this.otpExpires = undefined;
  }
  return isOtpValid;
};

userSchema.methods.hasAdminAccess = function () {
  return this.role === "super_admin" || this.role === "admin";
};

// Method to check if a user is an author
userSchema.methods.isAuthor = function () {
  return this.role === "author";
};

// Method to check if a user is a general user
userSchema.methods.isGeneralUser = function () {
  return this.role === "user";
};

const UserModel = db.model("User", userSchema);
export default UserModel;
