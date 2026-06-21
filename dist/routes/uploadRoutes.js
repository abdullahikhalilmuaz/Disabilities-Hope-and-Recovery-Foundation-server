"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
});
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Upload request received");
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }
        console.log("File:", req.file.originalname);
        console.log("Size:", req.file.size);
        const base64 = req.file.buffer.toString("base64");
        console.log("Uploading to Cloudinary...");
        const result = await cloudinary_1.default.uploader.upload(`data:${req.file.mimetype};base64,${base64}`, {
            folder: "dhrf/news",
        });
        console.log("Upload success");
        res.json({
            success: true,
            imageUrl: result.secure_url,
            public_id: result.public_id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
});
exports.default = router;
