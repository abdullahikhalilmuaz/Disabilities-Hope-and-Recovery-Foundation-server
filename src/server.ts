import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes";
import uploadRoute from "./routes/uploadRoutes";
import newsRoutes from "./routes/newsRoutes";
import adminRoutes from "./routes/adminRoutes"; // ← NEW
import donationRoutes from "./routes/donationRoutes";
import webhookRoutes from "./routes/webhookRoutes"; // ← NEW
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

connectDB();

app.use(cors());

// ─────────────────────────────────────────────────────────────────────────
// IMPORTANT: the Paystack webhook MUST be mounted BEFORE express.json().
// Verifying the `x-paystack-signature` header requires the exact raw
// request body bytes. Once express.json() parses the body into an object,
// that raw payload is gone and signature verification will always fail
// (or, if you skip verification, anyone can forge "payment successful"
// webhooks). webhookRoutes.ts applies its own express.raw() parser.
// ─────────────────────────────────────────────────────────────────────────
app.use("/api/donations/webhook", webhookRoutes);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ success: true, message: "DHRF API Running" });
});

app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes); // ← NEW  →  POST /api/admin/login
app.use("/api/donations", donationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
