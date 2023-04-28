const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const ApiFeatures = require("../libraries/apiFeatures");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  // Build Query
  const mongooseQuery = ProductModel.find();
  const queryString = req.query;
  const documentCounts = await ProductModel.countDocuments();
  const apiFeatures = new ApiFeatures(mongooseQuery, queryString)
    .paginate(documentCounts)
    .sort()
    .filter()
    .search()
    .limitFields();
  // .populate({
  //   path: "category",
  //   select: "name -_id",
  // });

  try {
    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;
    res
      .status(200)
      .json({ results: products.length, paginationResult, data: products });
  } catch (error) {
    console.log("test");
    res.status(400).send({ error: error.message });
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  //   .custom((val, { req }) =>

  //   ),

  const { title, category, subcategories } = req.body;
  req.body.slug = sulgify(title);

  try {
    const categoryProduct = await CategoryModel.findById(category);
    if (!categoryProduct) {
      return next(new ApiError(`Category not found`, 404));
    }

    const subCategoryProduct = await SubCategoryModel.find({
      _id: { $exists: true, $in: subcategories },
    });

    if (
      subCategoryProduct.length < 1 ||
      subCategoryProduct.length !== subcategories.length
    ) {
      return next(new ApiError(`Invalid subcategories Ids`, 404));
    }

    const subCategoriesDB = await SubCategoryModel.find({
      category,
    });

    const subCategoriesIdsInDB = [];
    subCategoriesDB.forEach((subCategory) => {
      subCategoriesIdsInDB.push(subCategory._id.toString());
    });
    // check if subcategories ids in db include subcategories in req.body (true)
    const checker = subcategories.every((item) =>
      subCategoriesIdsInDB.includes(item)
    );

    if (!checker) {
      return next(new ApiError(`subcategories not belong to category`, 404));
    }

    await ProductModel.create(req.body).then((doc) =>
      res.status(201).json({ data: doc })
    );
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
    const product = await ProductModel.findById(productId).populate({
      path: "category",
      select: "name -_id",
    });
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

  if (req.body.title) {
    req.body.slug = sulgify(title);
  }

  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true }
    );

    if (!product) {
      return next(new ApiError(`Product not found`, 404));
    }

    res.status(200).json({ data: product });
  } catch (error) {
    return next(new ApiError(`No product for this ${productId}`, 401));
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
