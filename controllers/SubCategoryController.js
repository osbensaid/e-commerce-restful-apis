const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @route   GET /api/v1/categories/categoryId/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategoryModel);

// @desc    Create subcategory
// @route   POST /api/v1/subcategories
// @route   POST /api/v1/categories/categoryId/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategoryModel);

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategoryModel);

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel);

// @desc    Delete SubCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);

// Middleware function that sets A category
exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
