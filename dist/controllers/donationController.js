"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDonations = exports.verifyDonation = exports.initializeDonation = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Donation_1 = __importDefault(require("../models/Donation"));
const paystackService_1 = require("../services/paystackService");
/**
 * Initialize Donation
 * POST /api/donations/initialize
 */
const initializeDonation = async (req, res) => {
    try {
        const { fullName, email, phone, amount, message, donationType } = req.body;
        if (!fullName || !email || !amount) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and amount are required",
            });
        }
        const numericAmount = Number(amount);
        if (!numericAmount || Number.isNaN(numericAmount) || numericAmount < 100) {
            return res.status(400).json({
                success: false,
                message: "Amount must be at least ₦100",
            });
        }
        const normalizedDonationType = donationType === "monthly" ? "monthly" : "one-time";
        const reference = "DHRF-" + crypto_1.default.randomBytes(10).toString("hex");
        const donation = await Donation_1.default.create({
            fullName,
            email,
            phone,
            amount: numericAmount,
            reference,
            status: "pending",
            message,
            donationType: normalizedDonationType,
        });
        const paystackResponse = await (0, paystackService_1.initializeTransaction)(email, numericAmount, reference, {
            fullName,
            donationType: normalizedDonationType,
            message,
        });
        res.status(200).json({
            success: true,
            authorization_url: paystackResponse.data.authorization_url,
            reference,
            donation,
        });
    }
    catch (error) {
        console.error(error?.response?.data || error);
        res.status(500).json({
            success: false,
            message: "Failed to initialize donation",
        });
    }
};
exports.initializeDonation = initializeDonation;
/**
 * Verify Donation
 * GET /api/donations/verify/:reference
 *
 * Called by the frontend's /donate/success page after Paystack redirects
 * the donor back. If the webhook already confirmed this donation, we skip
 * calling Paystack again and just return what's in the DB.
 */
const verifyDonation = async (req, res) => {
    try {
        const reference = req.params.reference;
        const donation = await Donation_1.default.findOne({ reference });
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found",
            });
        }
        // Webhook may have already marked this success — no need to re-verify.
        if (donation.status === "success") {
            return res.status(200).json({ success: true, data: donation });
        }
        const verification = await (0, paystackService_1.verifyTransaction)(reference);
        const payment = verification.data;
        const paystackStatus = payment.status;
        if (paystackStatus === "success") {
            donation.status = "success";
        }
        else if (paystackStatus === "failed" ||
            paystackStatus === "abandoned" ||
            paystackStatus === "reversed") {
            // Definitive non-success outcome.
            donation.status = "failed";
        }
        // Anything else (e.g. "pending", "queued" — typical for bank transfer
        // that hasn't cleared yet) is left as "pending". The frontend shows a
        // "still processing" message, and the webhook will update it for real
        // once Paystack confirms either way.
        if (payment.channel)
            donation.channel = payment.channel;
        if (payment.paid_at)
            donation.paidAt = payment.paid_at;
        if (payment.authorization?.brand)
            donation.cardBrand = payment.authorization.brand;
        if (payment.authorization?.last4)
            donation.cardLast4 = payment.authorization.last4;
        if (payment.gateway_response)
            donation.gatewayResponse = payment.gateway_response;
        await donation.save();
        res.status(200).json({
            success: true,
            data: donation,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to verify donation",
        });
    }
};
exports.verifyDonation = verifyDonation;
/**
 * Get All Donations
 * GET /api/donations  (admin only)
 */
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation_1.default.find().sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch donations",
        });
    }
};
exports.getAllDonations = getAllDonations;
