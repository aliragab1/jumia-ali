const { uploadMixOfFiles } = require("../middlewares/uploadImageMiddleware");
const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  setcategoryIdToBody,
} = require("../services/productService");
const authService = require("../services/authService");
const router = express.Router({ mergeParams: true });
// const router = require("express").Router();
let fields = [
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
];
router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "seller"),
    uploadMixOfFiles(fields, "products"),
    setcategoryIdToBody,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "seller"),
    uploadMixOfFiles(fields, "products"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "seller"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
