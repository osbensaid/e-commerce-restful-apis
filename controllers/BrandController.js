const ApiError = require("../libraries/apiErrors");
const BrandModel = require("../models/brandModel");
const ApiFeatures = require("../libraries/apiFeatures");
const { sulgify } = require("../Libraries/Slugify");
const factory = require("./handlerFactory");

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = async (req, res) => {
  // Build Query
  const mongooseQuery = BrandModel.find();
  const queryString = req.query;
  const documentCounts = await BrandModel.countDocuments();
  const apiFeatures = new ApiFeatures(mongooseQuery, queryString)
    .paginate(documentCounts)
    .sort()
    .filter()
    .search()
    .limitFields();

  try {
    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;
    res
      .status(200)
      .json({ results: brands.length, paginationResult, data: brands });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Get Single Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = async (req, res, next) => {
  const brandId = req.params.id;
  try {
    const brand = await BrandModel.findById(brandId);
    if (!brand) {
      return next(new ApiError(`Brand not found`, 404));
    }
    res.status(200).json({ data: brand });
  } catch (error) {
    return next(new ApiError(`No brand for this ${brandId}`, 404));
  }
};

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
