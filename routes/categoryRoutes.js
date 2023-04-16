const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/CategoryController");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../libraries/validators/categoryValidator");
const subCategoryRoutes = require("./subCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .post(createCategoryValidator, createCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
