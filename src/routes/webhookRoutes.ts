import express from "express";
import { paystackWebhook } from "../controllers/paystackWebhook";

const router = express.Router();

// type: "application/json" tells express.raw() to still only grab bodies
// that are sent as JSON, but it hands the controller a raw Buffer instead
// of a parsed object — required for HMAC signature verification.
router.post("/", express.raw({ type: "application/json" }), paystackWebhook);

export default router;