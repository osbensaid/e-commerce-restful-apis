const BrandModel = require("../models/brandModel");
const factory = require("./handlerFactory");

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(BrandModel);
// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Get Single Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(BrandModel);

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
