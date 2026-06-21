import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    donationType: {
      type: String,
      enum: ["one-time", "monthly"],
      default: "one-time",
    },

    message: {
      type: String,
      default: "",
    },

    channel: {
      type: String, // e.g. "card", "bank_transfer" — set once payment confirms
    },

    cardBrand: {
      type: String, // e.g. "visa", "mastercard" — only set for card payments
    },

    cardLast4: {
      type: String, // last 4 digits — only set for card payments
    },

    gatewayResponse: {
      type: String, // Paystack's human-readable outcome, e.g. "Declined"
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Donation", donationSchema);
