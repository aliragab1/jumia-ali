const express = require("express");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");
const authService = require("../services/authService");

const router = express.Router();
router
  .route("/")
  .post(authService.protect, authService.allowedTo("user"), createReview)
  .get(getReviews);
router
  .route("/:id")
  .get(getReview)
  .put(authService.protect, authService.allowedTo("user"), updateReview)
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user"),
    deleteReview
  );

module.exports = router;
