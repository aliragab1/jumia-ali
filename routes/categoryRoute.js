const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");
const { uploadSingleFile } = require("../middlewares/uploadImageMiddleware");
const authService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");
const router = express.Router();
router.use("/:categoryId/subcategories", subCategoryRoute);
router.use("/:categoryId/products", productRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "categories"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "categories"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
