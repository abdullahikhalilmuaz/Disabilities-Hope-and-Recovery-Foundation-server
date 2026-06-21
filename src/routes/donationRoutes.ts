import express from "express";

import {
  initializeDonation,
  verifyDonation,
  getAllDonations,
} from "../controllers/donationController";

// import { protect } from "../middleware/auth";

const router = express.Router();

// Public — start a donation, get the Paystack checkout URL back
router.post("/initialize", initializeDonation);

// Public — called by the frontend's /donate/callback page right after
// Paystack redirects the donor back. Also doubles as the source of truth
// the webhook keeps in sync.
router.get("/verify/:reference", verifyDonation);

// Admin only — list all donations
router.get("/", getAllDonations);

export default router;
