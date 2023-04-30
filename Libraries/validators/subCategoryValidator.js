const { isMongoId, isEmpty, isLength } = require("validator");
const { sulgify } = require("../../Libraries/Slugify");
const ApiError = require("../apiErrors");

const createSubCategoryValidator = (req, res, next) => {
  const errors = [];
  const { name, category } = req.body;

  if (isEmpty(name)) {
    errors.push({
      value: name,
      msg: "Subcategory name is required",
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

  if (isEmpty(category)) {
    errors.push({
      value: name,
      msg: "Category name is required",
      param: "name",
    });
  }

  if (!isMongoId(category)) {
    errors.push({
      value: name,
      msg: "Subcategory must be belong to a category",
      param: "name",
    });
  }

  // Check if there were any validation errors
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  req.body.slug = sulgify(name);

  next();
};

const getSubCategoryValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid SubCategory ID Format`, 400));
  }
  next();
};

const updateSubCategoryValidator = (req, res, next) => {
  const { id } = req.params;
  if (!isMongoId(id)) {
    return next(new ApiError(`Invalid SubCategory ID Format`, 400));
  }
  req.body.slug = sulgify(req.body.name);
  next();
};

const deleteSubCategoryValidator = (req, res, next) => {
  const categoryId = req.params.id;
  if (!isMongoId(categoryId)) {
    return next(new ApiError(`Invalid SubCategory ID Format`, 400));
  }
  next();
};

module.exports = {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
