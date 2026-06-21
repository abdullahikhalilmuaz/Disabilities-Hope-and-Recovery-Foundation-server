"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
router.post("/", auth_1.protect, newsController_1.createNews);
router.get("/", newsController_1.getAllNews);
router.get("/:slug", newsController_1.getNewsBySlug);
router.put("/:id", auth_1.protect, newsController_1.updateNews);
router.delete("/:id", auth_1.protect, newsController_1.deleteNews);
exports.default = router;
