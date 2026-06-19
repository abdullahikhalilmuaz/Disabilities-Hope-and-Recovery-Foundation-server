import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// CLOUDINARY_CLOUD_NAME=dbarjbnzl
// CLOUDINARY_API_KEY=976617643473261
// CLOUDINARY_API_SECRET=1foEC269V_TnbSxICvqUoW70aTM
