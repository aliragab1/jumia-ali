const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/ApiFeatures");
const ProductModel = require("../models/productModel");
const cloudinary = require("cloudinary");

exports.setcategoryIdToBody = (req, res, next) => {
  // Nested
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send("upload image error");
      resolve({
        res: res.secure_url,
      });
    });
  });
};

// to add new products
exports.createProduct = asyncHandler(async (req, res) => {
  const urlsOfImages = [];
  if (req.files.images) {
    const filesImages = req.files.images;
    for (const file of filesImages) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      urlsOfImages.push(newPath);
    }
  }

  const urlsOfImageCover = [];
  if (req.files.imageCover) {
    const files = req.files.imageCover;
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      urlsOfImageCover.push(newPath);
    }
  }

  if (urlsOfImages) {
    req.body.images = urlsOfImages.map((url) => url.res);
  }
  if (urlsOfImageCover) {
    req.body.imageCover = urlsOfImageCover[0]?.res || " ";
  }

  req.body.slug = slugify(req.body.name);
  req.body.seller = req.user._id;
  const Product = new ProductModel(req.body);
  await Product.save();
  res.status(201).json({ data: Product });
});

// to update specific Product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.files.images);
  if (req.files.images) {
    const urlsOfImages = [];
    const filesImages = req.files.images;
    for (const file of filesImages) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      urlsOfImages.push(newPath);
    }
    req.body.images = urlsOfImages.map((url) => url.res);
  }

  if (req.files.imageCover) {
    const urlsOfImageCover = [];
    const files = req.files.imageCover;
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      urlsOfImageCover.push(newPath);
    }
    req.body.imageCover = urlsOfImageCover[0]?.res || " ";
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  let Product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !Product && next(new ApiError("Product not found", 400));
  Product && res.status(200).json({ data: Product });
});

// to get all Products
exports.getProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  // if (req.params.userId) {
  //   filter = { seller: req.params.userId };
  // }
  let apiFeatures = new ApiFeatures(ProductModel.find(filter), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();

  Products = await apiFeatures.mongooseQuery;
  res.status(200).json({
    status: "success",
    results: Products.length,
    page: apiFeatures.page,
    limit: apiFeatures.limit,
    Products,
  });
});

// to get specific Product
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let Product = await ProductModel.findById(id);
  !Product && next(new ApiError("Product not found", 400));
  Product && res.status(200).json(Product);
});

// to delete specific Product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(204).send();
});

// // to update specific Product
// exports.updateProduct = asyncHandler(async (req, res, next) => {
//   let imgs = [];
//   const { id } = req.params;
//   if (req.body.name) {
//     req.body.slug = slugify(req.body.name);
//   }

//   if (req.body.imageCover) {
//     req.body.imageCover = req.files.imageCover[0].filename;
//   }
//   // req.body.imageCover = req.files?.imageCover[0]?.filename;
//   req.files?.images?.forEach((elm) => {
//     imgs.push(elm.filename);
//   });
//   req.body.images = imgs;
//   let Product = await ProductModel.findByIdAndUpdate(id, req.body, {
//     new: true,
//   });
//   !Product && next(new ApiError("Category not found", 400));
//   Product && res.status(200).json(Product);
// });

// exports.createProduct = asyncHandler(async (req, res) => {
//   // let imgs = [];
//   // req.files.images.forEach((img) => {
//   //   imgs.push(img.path);
//   // });
//   console.log(req.files);
//   cloudinary.v2.uploader.upload(
//     req.files.imageCover[0].path,
//     async (error, result) => {
//       console.log(result);
//       req.body.imageCover = result.secure_url;

//       req.body.slug = slugify(req.body.name);
//       req.body.seller = req.user._id;
//       let Product = new ProductModel(req.body);
//       await Product.save();
//       res.status(201).json({ data: Product });
//     }
//   );
// });

// to add new products
// exports.createProduct = catchAsyncError(async (req, res) => {
//   let imgs = [];
//   req.body.slug = slugify(req.body.name);
//   req.body.imageCover = req.files.imageCover[0].filename;
//   req.files.images.forEach((img) => {
//     imgs.push(img.filename);
//   });
//   req.body.images = imgs;
//   let Product = new ProductModel(req.body);
//   await Product.save();
//   res.status(200).json(Product);
// });

// to add new products
// exports.createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.name);
//   req.body.seller = req.user._id;
//   let Product = new ProductModel(req.body);
//   await Product.save();
//   res.status(200).json(Product);
// });
