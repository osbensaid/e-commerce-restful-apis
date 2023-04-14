const { isMongoId, isEmpty, isLength } = require("validator");
const ApiError = require("../../libraries/apiErrors");

// {
//   errors: [
//     {
//       value: "",
//       msg: "mname is required",
//       param: "name",
//       location: "body",
//     },
//   ];
// }
const createCategoryValidator = (req, res, next) => {
  const errors = [];
  const name = req.body.name;

  if (isEmpty(name)) {
    errors.push({
      value: name,
      msg: "Category name is required",
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

const getCategoryValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Category ID Format`, 400));
  }
  next();
};

const updateCategoryValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Category ID Format`, 400));
  }
  next();
};

const deleteCategoryValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid Category ID Format`, 400));
  }
  next();
};

module.exports = {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
