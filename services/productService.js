const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/ApiFeatures");
const ProductModel = require("../models/productModel");

exports.setcategoryIdToBody = (req, res, next) => {
  // Nested
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// to add new products
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  let Product = new ProductModel(req.body);
  await Product.save();
  res.status(200).json(Product);
});

// to get all Products
exports.getProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
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
  !Product && next(new ApiError("Category not found", 400));
  Product && res.status(200).json(Product);
});

// to update specific Product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let imgs = [];
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (req.body.imageCover) {
    req.body.imageCover = req.files.imageCover[0].filename;
  }
  // req.body.imageCover = req.files?.imageCover[0]?.filename;
  req.files?.images?.forEach((elm) => {
    imgs.push(elm.filename);
  });
  req.body.images = imgs;
  let Product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !Product && next(new ApiError("Category not found", 400));
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
