"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes")); // ← NEW
const donationRoutes_1 = __importDefault(require("./routes/donationRoutes"));
const webhookRoutes_1 = __importDefault(require("./routes/webhookRoutes")); // ← NEW
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use((0, cors_1.default)());
// ─────────────────────────────────────────────────────────────────────────
// IMPORTANT: the Paystack webhook MUST be mounted BEFORE express.json().
// Verifying the `x-paystack-signature` header requires the exact raw
// request body bytes. Once express.json() parses the body into an object,
// that raw payload is gone and signature verification will always fail
// (or, if you skip verification, anyone can forge "payment successful"
// webhooks). webhookRoutes.ts applies its own express.raw() parser.
// ─────────────────────────────────────────────────────────────────────────
app.use("/api/donations/webhook", webhookRoutes_1.default);
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ success: true, message: "DHRF API Running" });
});
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/news", newsRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default); // ← NEW  →  POST /api/admin/login
app.use("/api/donations", donationRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
