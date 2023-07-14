const mongoose = require("mongoose");
// 1- Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "review name required"],
      trim: true,
      minlength: [1, "too short review name"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    ratingAverage: {
      type: Number,
      min: [1, "ratingAverage must be greater than 1"],
      min: [5, "ratingAverage must be less than 5"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});

module.exports = mongoose.model("Review", reviewSchema);
