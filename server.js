import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import lessonRoutes from "./Routes/lessonRoutes.js";

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/lessons", lessonRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
