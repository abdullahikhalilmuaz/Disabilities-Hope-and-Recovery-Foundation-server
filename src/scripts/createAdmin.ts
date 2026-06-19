import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin";

dotenv.config();

mongoose.connect(process.env.MONGO_URI!);

async function createAdmin() {
  try {
    const hashedPassword =
      await bcrypt.hash("admin1234", 10);

    await Admin.create({
      email: "admin@dhrf.org.ng",
      password: hashedPassword,
    });

    console.log("Admin Created");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();