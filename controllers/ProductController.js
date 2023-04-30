const ApiError = require("../libraries/apiErrors");
const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(ProductModel);

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  const { category, subcategories } = req.body;

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
exports.getProduct = factory.getOne(ProductModel);

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);
