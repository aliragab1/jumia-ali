const ReviewModel = require("../models/reviewModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.createReview = asyncHandler(async (req, res, next) => {
  const isReview = await ReviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });

  if (isReview)
    return next(new ApiError("you are created a review before", 400));

  let Review = new ReviewModel(req.body);
  await Review.save();
  res.status(200).json({ status: "success", Review, user: req.user.name });
});

// to get all Reviews
exports.getReviews = asyncHandler(async (req, res) => {
  let Reviews = await ReviewModel.find({});

  res.status(200).json(Reviews);
});

// to get specific Review
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let Review = await ReviewModel.findById(id);
  !Review && next(new ApiError("Review not found", 400));
  Review && res.status(200).json(Review);
});

// to update specific Review
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let isReview = await ReviewModel.findById(id);
  console.log(req.user._id.toString());
  console.log(isReview.user._id.toString());
  if (isReview.user._id.toString() == req.user._id.toString()) {
    let Review = await ReviewModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    !Review && next(new ApiError("Review not found", 400));
    Review && res.status(200).json(Review);
  } else {
    next(new ApiError("you are not the review you are looking for", 400));
  }
});

// to delete specific Review
// exports.deleteReview = factory.deleteOne(ReviewModel);
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Review = await ReviewModel.findByIdAndDelete(id);

  if (!Review) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No Review for this id ${id}`, 404));
  }
  res.status(204).send();
});
