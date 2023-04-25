const { isMongoId, isEmpty, isLength } = require("validator");
const ApiError = require("../apiErrors");

const createProductValidator = (req, res, next) => {
  const errors = [];
  const name = req.body.name;

  if (isEmpty(name)) {
    errors.push({
      value: name,
      msg: "Product name is required",
      param: "name",
    });
  }

  if (!isLength(name, { min: 3 })) {
    errors.push({
      value: name,
      msg: "Name must be at least 3 characters long",
      param: "name",
    });
  }

  if (!isLength(name, { max: 32 })) {
    errors.push({
      value: name,
      msg: "Name must be no more than 32 characters long",
      param: "name",
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
