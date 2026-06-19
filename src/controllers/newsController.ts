import { Request, Response } from "express";
import News from "../models/News";


export const createNews = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);

    const news = await News.create(req.body);

    res.status(201).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create article",
    });
  }
};


/**
 * GET ALL NEWS
 */
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
};

/**
 * GET SINGLE NEWS
 */
export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const article = await News.findOne({
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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

/**
 * UPDATE NEWS
 */
export const updateNews = async (req: Request, res: Response) => {
  try {
    const article = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update article",
    });
  }
};

/**
 * DELETE NEWS
 */
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const article = await News.findByIdAndDelete(
      req.params.id
    );

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
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete article",
    });
  }
};