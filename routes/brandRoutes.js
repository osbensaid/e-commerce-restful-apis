const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/BrandController");

const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../libraries/validators/brandValidator");
const subCategoryRoutes = require("./subCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/")
  .post(createBrandValidator, createBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
