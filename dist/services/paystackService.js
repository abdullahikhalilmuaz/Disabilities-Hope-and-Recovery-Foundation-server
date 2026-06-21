"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransaction = exports.initializeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const paystack = axios_1.default.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});
const initializeTransaction = async (email, amount, reference, metadata) => {
    const response = await paystack.post("/transaction/initialize", {
        email,
        amount: amount * 100, // Paystack expects kobo, not naira
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata,
    });
    return response.data;
};
exports.initializeTransaction = initializeTransaction;
const verifyTransaction = async (reference) => {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data;
};
exports.verifyTransaction = verifyTransaction;
exports.default = paystack;
