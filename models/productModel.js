const mongoose = require("mongoose");
// 1- Create Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name required"],
      trim: true,
      unique: [true, "Product name unique"],
      minlength: [2, "too short Product name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      trim: true,
      minlength: [10, "too short Product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
      default: 0,
    },
    colors: [String],
    price: {
      type: Number,
      required: [true, "Product price required"],
    },
    priceAfterDiscount: {
      type: Number,
      required: [true, "Product price after discount required"],
    },
    sold: {
      type: Number,
      required: [true, "Product sold required"],
      default: 0,
    },
    imageCover: String,
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product category required"],
    },
    subcategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Subcategory",
      required: [true, "Product subcategory required"],
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      required: [true, "Product brand required"],
    },
    averageRating: {
      type: Number,
      min: [1, "ratingAverage must be greater than 1"],
      max: [5, "ratingAverage must be less than 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.post("init", (doc) => {
//   let imgs = [];
//   doc.imageCover = "http://localhost:8000/products/" + doc.imageCover;
//   doc.images.forEach((elm) => {
//     imgs.push("http://localhost:8000/products/" + elm);
//   });
//   doc.images = imgs;
// });

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre("findOne", function () {
  this.populate([
    {
      path: "reviews",
      select: "title",
    },
  ]);
});

// // Mongoose query middleware
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name -_id",
//   });
//   next();
// });

// const setImageURL = (doc) => {
//   if (doc.imageCover) {
//     const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
//     doc.imageCover = imageUrl;
//   }
//   if (doc.images) {
//     const imagesList = [];
//     doc.images.forEach((image) => {
//       const imageUrl = `${process.env.BASE_URL}/products/${image}`;
//       imagesList.push(imageUrl);
//     });
//     doc.images = imagesList;
//   }
// };
// // findOne, findAll and update
// productSchema.post("init", (doc) => {
//   setImageURL(doc);
// });

// // create
// productSchema.post("save", (doc) => {
//   setImageURL(doc);
// });

// 2- Create model
module.exports = mongoose.model("Product", productSchema);
