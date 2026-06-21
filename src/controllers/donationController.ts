import { Request, Response } from "express";
import crypto from "crypto";

import Donation from "../models/Donation";

import {
  initializeTransaction,
  verifyTransaction,
} from "../services/paystackService";

/**
 * Initialize Donation
 * POST /api/donations/initialize
 */
export const initializeDonation = async (req: Request, res: Response) => {
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

    const normalizedDonationType =
      donationType === "monthly" ? "monthly" : "one-time";

    const reference = "DHRF-" + crypto.randomBytes(10).toString("hex");

    const donation = await Donation.create({
      fullName,
      email,
      phone,
      amount: numericAmount,
      reference,
      status: "pending",
      message,
      donationType: normalizedDonationType,
    });

    const paystackResponse = await initializeTransaction(
      email,
      numericAmount,
      reference,
      {
        fullName,
        donationType: normalizedDonationType,
        message,
      },
    );

    res.status(200).json({
      success: true,
      authorization_url: paystackResponse.data.authorization_url,
      reference,
      donation,
    });
  } catch (error: any) {
    console.error(error?.response?.data || error);

    res.status(500).json({
      success: false,
      message: "Failed to initialize donation",
    });
  }
};

/**
 * Verify Donation
 * GET /api/donations/verify/:reference
 *
 * Called by the frontend's /donate/callback page after Paystack redirects
 * the donor back. If the webhook already confirmed this donation, we skip
 * calling Paystack again and just return what's in the DB.
 */
export const verifyDonation = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const donation = await Donation.findOne({ reference });

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

    const verification = await verifyTransaction(reference);
    const payment = verification.data;

    donation.status = payment.status === "success" ? "success" : "failed";
    if (payment.channel) donation.channel = payment.channel;
    if (payment.paid_at) donation.paidAt = payment.paid_at;

    await donation.save();

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to verify donation",
    });
  }
};

/**
 * Get All Donations
 * GET /api/donations  (admin only)
 */
export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};
