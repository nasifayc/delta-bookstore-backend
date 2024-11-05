import express from "express";
import cors from "cors";
import db from "./database/mongoose.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
