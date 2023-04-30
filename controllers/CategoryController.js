const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const CategoryModel = require("../models/categoryModel");
const ApiFeatures = require("../libraries/apiFeatures");
const factory = require("./handlerFactory");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
  // Build Query
  const mongooseQuery = CategoryModel.find();
  const queryString = req.query;
  const documentCounts = await CategoryModel.countDocuments();
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
    res
      .status(200)
      .json({ results: categories.length, paginationResult, data: categories });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(CategoryModel);

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return next(new ApiError(`Category not found`, 404));
    }
    res.status(200).json({ data: category });
  } catch (error) {
    return next(new ApiError(`No category for this ${categoryId}`, 404));
  }
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
