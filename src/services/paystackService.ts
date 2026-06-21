import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializeTransaction = async (
  email: string,
  amount: number,
  reference: string,
  metadata?: Record<string, unknown>,
) => {
  const response = await paystack.post("/transaction/initialize", {
    email,
    amount: amount * 100, // Paystack expects kobo, not naira
    reference,
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
    metadata,
  });

  return response.data;
};

export const verifyTransaction = async (reference: string) => {
  const response = await paystack.get(`/transaction/verify/${reference}`);
  return response.data;
};

export default paystack;
