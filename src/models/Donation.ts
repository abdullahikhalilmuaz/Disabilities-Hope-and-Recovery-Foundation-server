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

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donation", donationSchema);