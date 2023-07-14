// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     cartItems: [
//       {
//         product: {
//           type: mongoose.Schema.ObjectId,
//           ref: "Product",
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//         color: String,
//         price: Number,
//       },
//     ],
//     totalCartPrice: Number,
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// cartSchema.pre(/^find/, function () {
//   this.populate({ path: `cartItems.product`, select: "name , imageCover" });
// });

// module.exports = mongoose.model("Cart", cartSchema);

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
        imageCover: String,
        name: String,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
