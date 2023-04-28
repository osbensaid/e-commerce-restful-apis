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
exports.createSubCategory = async (req, res) => {
  const { name, category } = req.body;
  const slug = sulgify(name);
  try {
    await SubCategoryModel.create({
      name,
      slug,
      category,
    }).then((doc) => res.status(201).json(doc));
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSubCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await SubCategoryModel.findById(categoryId);
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
exports.updateSubCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  const { name, category } = req.body;
  const slug = sulgify(name);

  try {
    const categoryQuery = await SubCategoryModel.findOneAndUpdate(
      { _id: categoryId },
      { name, slug, category },
      { new: true }
    );

    if (!categoryQuery) {
      return next(new ApiError(`SubCategory not found`, 404));
    }

    res.status(200).json({ data: categoryQuery });
  } catch (error) {
    return next(new ApiError(`No Subcategory for this ${categoryId}`, 404));
  }
};

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
