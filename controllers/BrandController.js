const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const BrandModel = require("../models/brandModel");

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  try {
    const brands = await BrandModel.find({})
      .skip(skip)
      .limit(limit);
    res.status(200).json({ results: brands.length, page, data: brands });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = async (req, res) => {
  const { name } = req.body;
  const slug = sulgify(name);
  try {
    await BrandModel.create({
      name: name,
      slug: slug,
    }).then((doc) => res.status(201).json(doc));
  } catch (error) {
    res.status(400).json(error);
  }
};

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
exports.updateBrand = async (req, res, next) => {
  const brandId = req.params.id;

  const { name } = req.body;
  const slug = sulgify(name);

  try {
    const brand = await BrandModel.findOneAndUpdate(
      { _id: brandId },
      { name, slug },
      { new: true }
    );

    if (!brand) {
      return next(new ApiError(`Brand not found`, 404));
    }

    res.status(200).json({ data: brand });
  } catch (error) {
    return next(new ApiError(`No brand for this ${brandId}`, 404));
  }
};

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = async (req, res, next) => {
  const brandId = req.params.id;
  try {
    const brand = await BrandModel.findByIdAndDelete(brandId);
    if (!brand) {
      return next(new ApiError(`Brand not found`, 404));
    }
    res.status(200).json(brand);
  } catch (error) {
    return next(new ApiError(`No brand for this ${brandId}`, 404));
  }
};
