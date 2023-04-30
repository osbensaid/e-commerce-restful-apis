const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiFeatures = require("../libraries/apiFeatures");
const factory = require("./handlerFactory");

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @route   GET /api/v1/categories/categoryId/subcategories
// @access  Public
exports.getSubCategories = async (req, res) => {
  // Build Query
  const { categoryId } = req.params;
  const filterObject = categoryId ? { category: categoryId } : {};
  const mongooseQuery = SubCategoryModel.find(filterObject);
  const queryString = req.query;
  const documentCounts = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(mongooseQuery, queryString)
    .paginate(documentCounts)
    .sort()
    .filter()
    .search()
    .limitFields();

  try {
    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;
    //.populate({ path: "subcategory", select: "name -_id" });
    res
      .status(200)
      .json({ results: categories.length, paginationResult, data: categories });
  } catch (error) {
    res.status(400).send(error);
  }
};

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
