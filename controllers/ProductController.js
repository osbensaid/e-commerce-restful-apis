const { sulgify } = require("../Libraries/Slugify");
const ApiError = require("../libraries/apiErrors");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");

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
      .limit(limit)
      .populate({ path: "category", select: "name -_id" });
    res.status(200).json({ results: products.length, page, data: products });
  } catch (error) {
    res.status(400).send(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  //     .custom((subcategoriesIds) =>
  //     SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
  //       (result) => {
  //         if (result.length < 1 || result.length !== subcategoriesIds.length) {
  //           return Promise.reject(new Error(`Invalid subcategories Ids`));
  //         }
  //       }
  //     )
  //   )
  //   .custom((val, { req }) =>
  //     SubCategory.find({ category: req.body.category }).then(
  //       (subcategories) => {
  //         const subCategoriesIdsInDB = [];
  //         subcategories.forEach((subCategory) => {
  //           subCategoriesIdsInDB.push(subCategory._id.toString());
  //         });
  //         // check if subcategories ids in db include subcategories in req.body (true)
  //         const checker = (target, arr) => target.every((v) => arr.includes(v));
  //         if (!checker(val, subCategoriesIdsInDB)) {
  //           return Promise.reject(
  //             new Error(`subcategories not belong to category`)
  //           );
  //         }
  //       }
  //     )
  //   ),

  const { title, category } = req.body;
  req.body.slug = sulgify(title);

  try {
    const categoryProduct = await CategoryModel.findById(category);
    if (!categoryProduct) {
      return next(new ApiError(`Category not found`, 404));
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
