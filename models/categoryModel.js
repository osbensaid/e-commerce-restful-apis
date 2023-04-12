const mongoose = require("mongoose");

// Create Schema
const CategorySchema = new mongoose.Schema({
  name: String,
});

// Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
