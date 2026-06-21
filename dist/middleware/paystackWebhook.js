"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Donation_1 = __importDefault(require("../models/Donation"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
/**
 * Paystack webhook handler.
 *
 * This is the reliable, server-to-server way donations get marked
 * "success" — it does NOT depend on the donor's browser making it back
 * to your site. Make sure this exact URL is set as your webhook URL in
 * the Paystack dashboard (Settings → API Keys & Webhooks):
 *
 *   https://<your-backend-domain>/api/donations/webhook
 *
 * req.body here is a raw Buffer (see routes/webhookRoutes.ts), which is
 * required to verify the x-paystack-signature header.
 */
const paystackWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-paystack-signature"];
        if (!signature || !PAYSTACK_SECRET_KEY) {
            return res.sendStatus(400);
        }
        const rawBody = req.body;
        const expectedHash = crypto_1.default
            .createHmac("sha512", PAYSTACK_SECRET_KEY)
            .update(rawBody)
            .digest("hex");
        if (expectedHash !== signature) {
            console.warn("Paystack webhook: signature mismatch — ignoring request");
            return res.sendStatus(401);
        }
        const event = JSON.parse(rawBody.toString("utf8"));
        if (event.event === "charge.success") {
            const payment = event.data;
            await Donation_1.default.findOneAndUpdate({ reference: payment.reference }, {
                status: "success",
                paidAt: payment.paid_at || payment.paidAt || new Date(),
                channel: payment.channel,
                cardBrand: payment.authorization?.brand,
                cardLast4: payment.authorization?.last4,
                gatewayResponse: payment.gateway_response,
            });
        }
        else if (event.event === "charge.failed") {
            const payment = event.data;
            await Donation_1.default.findOneAndUpdate({ reference: payment.reference }, {
                status: "failed",
                channel: payment.channel,
                gatewayResponse: payment.gateway_response,
            });
        }
        // Other event types (transfer.success, subscription.* etc.) are
        // ignored for now — add more `else if` branches here if you start
        // using Paystack Plans/Subscriptions for the "monthly" donation type.
        // Always acknowledge quickly with 200 so Paystack doesn't keep retrying.
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Paystack webhook error:", error);
        res.sendStatus(500);
    }
};
exports.paystackWebhook = paystackWebhook;
