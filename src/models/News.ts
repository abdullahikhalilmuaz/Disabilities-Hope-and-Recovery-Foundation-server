import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "DHRF",
    },

    category: {
      type: String,
      default: "News",
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("News", newsSchema);