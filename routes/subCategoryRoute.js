const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setcategoryIdToBody,
} = require("../services/subCategoryService");
const { uploadSingleFile } = require("../middlewares/uploadImageMiddleware");
const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });
// const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "subCategories"),
    setcategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "subCategories"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
