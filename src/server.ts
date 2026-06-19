import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes";
import uploadRoute from "./routes/uploadRoutes";
import newsRoutes from "./routes/newsRoutes";
import adminRoutes from "./routes/adminRoutes"; // ← NEW
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "DHRF API Running" });
});

app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes); // ← NEW  →  POST /api/admin/login

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
