import jwt from "jsonwebtoken";

export const generateAcessToken = ({
  _id,
  username,
  email,
  phone,
  profileImage,
  role,
  isVerified,
  wishlistBooks,
  purchasedBooks,
}) => {
  return jwt.sign(
    {
      _id,
      username,
      email,
      phone,
      profileImage,
      role,
      isVerified,
      wishlistBooks,
      purchasedBooks,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const generateRefreshToken = ({
  _id,
  username,
  email,
  phone,
  profileImage,
  role,
  isVerified,
  wishlistBooks,
  purchasedBooks,
}) => {
  return jwt.sign(
    {
      _id,
      username,
      email,
      phone,
      profileImage,
      role,
      isVerified,
      wishlistBooks,
      purchasedBooks,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
