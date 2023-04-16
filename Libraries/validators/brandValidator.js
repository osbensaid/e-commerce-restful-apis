const { isMongoId, isEmpty, isLength } = require("validator");
const ApiError = require("../../libraries/apiErrors");

const createBrandValidator = (req, res, next) => {
  const errors = [];
  const name = req.body.name;

  if (isEmpty(name)) {
    errors.push({
      value: name,
      msg: "Brand name is required",
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

const getBrandValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Brand ID Format`, 400));
  }
  next();
};

const updateBrandValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Brand ID Format`, 400));
  }
  next();
};

const deleteBrandValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Brand ID Format`, 400));
  }
  next();
};

module.exports = {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
