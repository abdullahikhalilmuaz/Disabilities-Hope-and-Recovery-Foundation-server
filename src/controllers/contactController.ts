import { Request, Response } from "express";
import Contact from "../models/Contact";

export const submitContact = async (
  req: Request,
  res: Response
) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
    });
  }
};