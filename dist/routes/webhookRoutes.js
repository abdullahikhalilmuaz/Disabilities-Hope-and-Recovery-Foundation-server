"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paystackWebhook_1 = require("../middleware/paystackWebhook");
const router = express_1.default.Router();
// type: "application/json" tells express.raw() to still only grab bodies
// that are sent as JSON, but it hands the controller a raw Buffer instead
// of a parsed object — required for HMAC signature verification.
router.post("/", express_1.default.raw({ type: "application/json" }), paystackWebhook_1.paystackWebhook);
exports.default = router;
