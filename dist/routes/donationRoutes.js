"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const donationController_1 = require("../controllers/donationController");
// import { protect } from "../middleware/auth";
const router = express_1.default.Router();
// Public — start a donation, get the Paystack checkout URL back
router.post("/initialize", donationController_1.initializeDonation);
// Public — called by the frontend's /donate/callback page right after
// Paystack redirects the donor back. Also doubles as the source of truth
// the webhook keeps in sync.
router.get("/verify/:reference", donationController_1.verifyDonation);
// Admin only — list all donations
router.get("/", donationController_1.getAllDonations);
exports.default = router;
