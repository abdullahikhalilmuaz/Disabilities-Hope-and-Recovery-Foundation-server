"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const Admin_1 = __importDefault(require("../models/Admin"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URI);
async function createAdmin() {
    try {
        const hashedPassword = await bcryptjs_1.default.hash("admin1234", 10);
        await Admin_1.default.create({
            email: "admin@dhrf.org.ng",
            password: hashedPassword,
        });
        console.log("Admin Created");
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
createAdmin();
