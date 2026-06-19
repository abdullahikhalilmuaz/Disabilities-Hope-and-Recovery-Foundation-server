import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
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

    category: {
      type: String,
      default: "News",
    },

    featured: {
      type: Boolean,
      default: false,
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