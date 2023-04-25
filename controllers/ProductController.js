const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const ProductModel = require("../models/productModel");

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  try {
    const products = await ProductModel.find({})
      .skip(skip)
      .limit(limit);
    res.status(200).json({ results: products.length, page, data: products });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res) => {
  const { name } = req.body;
  const slug = sulgify(name);
  try {
    await ProductModel.create({
      name: name,
      slug: slug,
    }).then((doc) => res.status(201).json(doc));
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc    Get Single Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return next(new ApiError(`Product not found`, 404));
    }
    res.status(200).json({ data: product });
  } catch (error) {
    return next(new ApiError(`No product for this ${productId}`, 404));
  }
};

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;

  const { name } = req.body;
  const slug = sulgify(name);

  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: productId },
      { name, slug },
      { new: true }
    );

    if (!product) {
      return next(new ApiError(`Product not found`, 404));
    }

    res.status(200).json({ data: product });
  } catch (error) {
    return next(new ApiError(`No product for this ${productId}`, 404));
  }
};

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      return next(new ApiError(`Product not found`, 404));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(new ApiError(`No product for this ${productId}`, 404));
  }
};
