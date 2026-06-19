import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "dhrf/news",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

export const upload = multer({ storage });