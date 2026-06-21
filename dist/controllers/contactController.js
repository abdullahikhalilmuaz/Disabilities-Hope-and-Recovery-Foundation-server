"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const submitContact = async (req, res) => {
    try {
        const contact = await Contact_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: contact,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit contact form",
        });
    }
};
exports.submitContact = submitContact;
