import express from "express";
import cors from "cors";
import db from "./database/mongoose.js";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
