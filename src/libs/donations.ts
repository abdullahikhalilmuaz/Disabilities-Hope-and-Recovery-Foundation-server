// lib/donations.ts
//
// Set NEXT_PUBLIC_API_BASE_URL in your frontend .env.local, e.g.:
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000        (dev)
//   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com   (prod)

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type DonationType = "one-time" | "monthly";

export interface InitializeDonationPayload {
  fullName: string;
  email: string;
  phone?: string;
  amount: number;
  message?: string;
  donationType: DonationType;
}

export interface InitializeDonationResponse {
  success: boolean;
  authorization_url?: string;
  reference?: string;
  message?: string;
}

export async function initializeDonation(
  payload: InitializeDonationPayload
): Promise<InitializeDonationResponse> {
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

export interface DonationRecord {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  amount: number;
  reference: string;
  status: "pending" | "success" | "failed";
  donationType: DonationType;
  message?: string;
  createdAt: string;
}

export interface VerifyDonationResponse {
  success: boolean;
  data?: DonationRecord;
  message?: string;
}

export async function verifyDonation(
  reference: string
): Promise<VerifyDonationResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/donations/verify/${encodeURIComponent(reference)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to verify donation");
  }

  return data;
}