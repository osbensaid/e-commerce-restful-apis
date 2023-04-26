const {
  isMongoId,
  isEmpty,
  isLength,
  isNumeric,
  isDecimal,
} = require("validator");
const ApiError = require("../apiErrors");

const createProductValidator = (req, res, next) => {
  const errors = [];
  const {
    title,
    description,
    quantity,
    sold,
    price,
    priceAfterDiscount,
    colors,
    category,
    subcategory,
    brand,
    ratingsAverage,
    ratingsQuantity,
    imageCover,
    images,
  } = req.body;

  if (isEmpty(title)) {
    errors.push({
      value: title,
      msg: "Product title is required",
      param: "title",
    });
  }

  if (!isLength(title, { min: 3 })) {
    errors.push({
      value: title,
      msg: "Title must be at least 3 characters long",
      param: "title",
    });
  }

  if (isEmpty(description)) {
    errors.push({
      value: description,
      msg: "Description is required",
      param: "description",
    });
  }

  if (!isLength(description, { max: 2000 })) {
    errors.push({
      value: description,
      msg: "Description must be no more than 2000 characters long",
      param: "description",
    });
  }

  if (isEmpty(quantity.toString())) {
    errors.push({
      value: quantity,
      msg: "Product quantity is required",
      param: "quantity",
    });
  }

  if (!isNumeric(sold.toString())) {
    errors.push({
      value: sold,
      msg: "Product quantity must be a number",
      param: "sold",
    });
  }

  if (isEmpty(price.toString())) {
    errors.push({
      value: price,
      msg: "Product price is required",
      param: "price",
    });
  }

  if (!isNumeric(price.toString())) {
    errors.push({
      value: price,
      msg: "Product price must be a number",
      param: "price",
    });
  }

  if (!isLength(price.toString(), { max: 32 })) {
    errors.push({
      value: price,
      msg: "Product price is too long",
      param: "price",
    });
  }

  if (!isNumeric(priceAfterDiscount.toString())) {
    errors.push({
      value: priceAfterDiscount,
      msg: "Product priceAfterDiscount must be a number",
      param: "priceAfterDiscount",
    });
  }

  if (!isDecimal(priceAfterDiscount.toString())) {
    errors.push({
      value: priceAfterDiscount,
      msg: "Product priceAfterDiscount must be a decimal",
      param: "priceAfterDiscount",
    });
  }

  function isValidArrayOfStrings(value) {
    if (!Array.isArray(value)) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (!typeof str === value[i]) {
        return false;
      }
    }
    return true;
  }

  if (colors) {
    if (!isValidArrayOfStrings(colors)) {
      errors.push({
        value: colors,
        msg: "colors should be array of string",
        param: "colors",
      });
    }
  }

  if (isEmpty(imageCover)) {
    errors.push({
      value: imageCover,
      msg: "Product imageCover is required",
      param: "imageCover",
    });
  }

  if (images) {
    if (!isValidArrayOfStrings(images)) {
      errors.push({
        value: images,
        msg: "images should be array of string",
        param: "images",
      });
    }
  }

  if (isEmpty(category)) {
    errors.push({
      value: category,
      msg: "Product must be belong to a category",
      param: "category",
    });
  }

  if (!isMongoId(category)) {
    errors.push({
      value: category,
      msg: "Invalid Category ID Format",
      param: "category",
    });
  }

  if (subcategory) {
    if (!isMongoId(subcategory)) {
      errors.push({
        value: subcategory,
        msg: "Invalid subCategory ID Format",
        param: "subcategory",
      });
    }
  }

  if (subcategory) {
    if (!isMongoId(brand)) {
      errors.push({
        value: brand,
        msg: "Invalid brand ID Format",
        param: "brand",
      });
    }
  }

  if (!isNumeric(ratingsAverage.toString())) {
    errors.push({
      value: ratingsAverage,
      msg: "ratingsAverage must be a number",
      param: "ratingsAverage",
    });
  }

  if (!isLength(ratingsAverage.toString(), { min: 1 })) {
    errors.push({
      value: ratingsAverage,
      msg: "Rating must be above or equal 1.0",
      param: "ratingsAverage",
    });
  }

  if (!isLength(ratingsAverage.toString(), { max: 5 })) {
    errors.push({
      value: ratingsAverage,
      msg: "Rating must be below or equal 5.0",
      param: "ratingsAverage",
    });
  }

  if (!isNumeric(ratingsQuantity.toString())) {
    errors.push({
      value: ratingsQuantity,
      msg: "ratingsQuantity must be a number",
      param: "ratingsQuantity",
    });
  }

  // Check if there were any validation errors
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  next();
};

const getProductValidator = (req, res, next) => {
  const productId = req.params.id;
  if (!isMongoId(productId)) {
    return next(new ApiError(`Invalid Product ID Format`, 400));
  }
  next();
};

const updateProductValidator = (req, res, next) => {
  const productId = req.params.id;
  if (!isMongoId(productId)) {
    return next(new ApiError(`Invalid Product ID Format`, 400));
  }
  next();
};

const deleteProductValidator = (req, res, next) => {
  const productId = req.params.id;
  if (!isMongoId(productId)) {
    return next(new ApiError(`Invalid Product ID Format`, 400));
  }
  next();
};

module.exports = {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
