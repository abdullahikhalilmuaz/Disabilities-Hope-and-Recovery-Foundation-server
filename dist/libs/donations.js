"use strict";
// lib/donations.ts
//
// Set NEXT_PUBLIC_API_BASE_URL in your frontend .env.local, e.g.:
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000        (dev)
//   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com   (prod)
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDonation = initializeDonation;
exports.verifyDonation = verifyDonation;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
async function initializeDonation(payload) {
    const res = await fetch(`${API_BASE_URL}/api/donations/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.message || "Failed to start donation");
    }
    return data;
}
async function verifyDonation(reference) {
    const res = await fetch(`${API_BASE_URL}/api/donations/verify/${encodeURIComponent(reference)}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.message || "Failed to verify donation");
    }
    return data;
}
