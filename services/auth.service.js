import jwt from "jsonwebtoken";

export const generateAcessToken = (tokenData) => {
  return jwt.sign(
    { _id, username, email, phone, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (tokenData) => {
  return jwt.sign(
    { _id, username, email, phone, isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
