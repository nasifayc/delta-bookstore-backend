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

// Method to compare the entered password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware to hash password before saving it
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

// Method to set OTP and expiration time
userSchema.methods.setOtp = function (otp) {
  this.otp = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
};

// Method to verify OTP
userSchema.methods.verifyOtp = function (enteredOtp) {
  const isOtpValid = this.otp === enteredOtp && Date.now() < this.otpExpires;
  if (isOtpValid) {
    this.isVerified = true;
    this.otp = undefined;
    this.otpExpires = undefined;
  }
  return isOtpValid;
};

const UserModel = db.model("User", userSchema);
export default UserModel;
