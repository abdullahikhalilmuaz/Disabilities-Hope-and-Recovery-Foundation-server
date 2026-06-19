import express from "express";
import { protect } from "../middleware/auth";

import {
  createNews,
  getAllNews,
  getNewsBySlug,
  updateNews,
  deleteNews,
} from "../controllers/newsController";

const router = express.Router();

router.post("/", protect, createNews);

router.get("/", getAllNews);

router.get("/:slug", getNewsBySlug);

router.put("/:id", protect, updateNews);

router.delete("/:id", protect, deleteNews);

export default router;