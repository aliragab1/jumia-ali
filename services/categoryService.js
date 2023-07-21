const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const cloudinary = require("cloudinary");
// CLOUD_NAME=dwgbuqheo
// API_KEY=762745136828274
// API_SECRET=jw4fcqmyM4vAynd5_5at8_KmpCA

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

exports.createCategory = asyncHandler(async (req, res) => {
  if (req.file) {
    const result = await cloudinaryImageUploadMethod(req.file.path);
    console.log(result);
    req.body.image = result.res;
  }

  req.body.slug = slugify(req.body.name);
  let category = new Category(req.body);
  await category.save();
  res.status(201).json({ data: category });
});

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  // req.body.image = req.file?.filename;
  if (req.file) {
    const result = await cloudinaryImageUploadMethod(req.file.path);
    console.log(result);
    req.body.image = result.res;
  }

  let category = await Category.findByIdAndUpdate(id, req.body, { new: true });

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 400));
  }
  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private

// exports.createCategory = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.name);
//   req.body.image = req.file?.filename;
//   let category = new Category(req.body);
//   await category.save();
//   res.status(201).json({ data: category });
// });

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({
    results: categories.length,
    page,
    data: categories,
  });
});

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
