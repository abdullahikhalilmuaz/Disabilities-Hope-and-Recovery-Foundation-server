"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.getNewsBySlug = exports.getAllNews = exports.createNews = void 0;
const News_1 = __importDefault(require("../models/News"));
const createNews = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const news = await News_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: news,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create article",
        });
    }
};
exports.createNews = createNews;
/**
 * GET ALL NEWS
 */
const getAllNews = async (req, res) => {
    try {
        const news = await News_1.default.find().sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            count: news.length,
            data: news,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch news",
        });
    }
};
exports.getAllNews = getAllNews;
/**
 * GET SINGLE NEWS
 */
const getNewsBySlug = async (req, res) => {
    try {
        const article = await News_1.default.findOne({
            slug: req.params.slug,
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        res.status(200).json({
            success: true,
            data: article,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch article",
        });
    }
};
exports.getNewsBySlug = getNewsBySlug;
/**
 * UPDATE NEWS
 */
const updateNews = async (req, res) => {
    try {
        const article = await News_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        res.status(200).json({
            success: true,
            data: article,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update article",
        });
    }
};
exports.updateNews = updateNews;
/**
 * DELETE NEWS
 */
const deleteNews = async (req, res) => {
    try {
        const article = await News_1.default.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Article deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete article",
        });
    }
};
exports.deleteNews = deleteNews;
