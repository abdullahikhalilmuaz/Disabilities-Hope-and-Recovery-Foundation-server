import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
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

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64}`,
      {
        folder: "dhrf/news",
      },
    );

    console.log("Upload success");

    res.json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

export default router;
