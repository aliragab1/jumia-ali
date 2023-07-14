const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const brandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");
const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: "dwgbuqheo",
//   api_key: "762745136828274",
//   api_secret: "jw4fcqmyM4vAynd5_5at8_KmpCA",
// });

// exports.createBrand = asyncHandler(async (req, res) => {
//   cloudinary.v2.uploader.upload(req.file.path, async (error, result) => {
//     console.log(result);
//     req.body.image = result.secure_url;
//     req.body.slug = slugify(req.body.name);
//     let brand = new brandModel(req.body);
//     await brand.save();
//     res.status(201).json({ data: brand });
//   });
// });

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private

exports.createBrand = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  // req.body.image = req.file?.filename;
  let brand = new brandModel(req.body);
  await brand.save();
  res.status(201).json({ data: brand });
});

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const Brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: Brands.length, page, data: Brands });
});

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.image = req.file?.filename;
  let brand = await brandModel.findByIdAndUpdate(id, req.body, { new: true });

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 400));
  }
  res.status(200).json({ data: brand });
});

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);

  if (!brand) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(204).send();
});
