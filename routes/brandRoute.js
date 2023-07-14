const { uploadSingleFile } = require("../middlewares/uploadImageMiddleware");

const authService = require("../services/authService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const router = require("express").Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "brands"),
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("image", "brands"),
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
