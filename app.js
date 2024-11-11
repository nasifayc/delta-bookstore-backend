import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./database/mongoose.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";
import userRoutes from "./routes/user.route.js";

import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  const token = req.cookies["accessToken"];
  console.log("Token:", token);
  if (token) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
