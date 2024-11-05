import jwt from "jsonwebtoken";

export const generateAcessToken = ({
  _id,
  username,
  email,
  phone,
  isAdmin,
}) => {
  return jwt.sign(
    { _id, username, email, phone, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = ({
  _id,
  username,
  email,
  phone,
  isAdmin,
}) => {
  return jwt.sign(
    { _id, username, email, phone, isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
