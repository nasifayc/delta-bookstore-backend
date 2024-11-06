import express from "express";
import cors from "cors";
import db from "./database/mongoose.js";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";
import authorRoutes from "./routes/author.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/author", authorRoutes);

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
