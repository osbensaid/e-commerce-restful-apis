const mongoose = require("mongoose");

// Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    // A and B => URL/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
