const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const CategoryModel = require("../models/categoryModel");
const { isMongoId, isEmpty, isLength } = require("validator");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  try {
    const categories = await CategoryModel.find({})
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({ results: categories.length, page, data: categories });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = async (req, res) => {
  const name = req.body.name;
  const slug = sulgify(name);
  try {
    await CategoryModel.create({
      name: name,
      slug: slug,
    }).then((doc) => res.status(201).json(doc));
  } catch (error) {
    res.status(400).json(error);
  }
};

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
exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  const { name } = req.body;
  const slug = sulgify(name);

  try {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: categoryId },
      { name, slug },
      { new: true }
    );

    if (!category) {
      return next(new ApiError(`Category not found`, 404));
    }

    res.status(200).json({ data: category });
  } catch (error) {
    return next(new ApiError(`No category for this ${categoryId}`, 404));
  }
};

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return next(new ApiError(`Category not found`, 404));
    }
    res.status(200).json(category);
  } catch (error) {
    return next(new ApiError(`No category for this ${categoryId}`, 404));
  }
};
