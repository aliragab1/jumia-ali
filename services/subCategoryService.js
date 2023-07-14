const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/ApiFeatures");
const SubCategoryModel = require("../models/subCategoryModel");
exports.setcategoryIdToBody = (req, res, next) => {
  // Nested
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// to add new subcategories

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  req.body.image = req.file?.filename;
  console.log(req.body);
  let subcategory = new SubCategoryModel({
    name,
    slug: slugify(name),
    category,
    image: req.body.image,
  });
  await subcategory.save();
  res.status(200).json({ data: subcategory });
});

// to get all subcategories
exports.getSubCategories = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }

  let subcategories = await SubCategoryModel.find(filter).populate(
    "category",
    "name -_id"
  );
  res.status(200).json(subcategories);
});

// to get specific subcategory
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let subcategory = await SubCategoryModel.findById(id);
  if (!subcategory) {
    return next(new ApiError("Category not found", 400));
  }
  res.status(200).json(subcategory);
});

// to update specific subcategory
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // const { name, category } = req.body;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.image = req.file?.filename;
  let subcategory = await SubCategoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!subcategory) {
    return next(new ApiError("subcategory not found", 400));
  }
  res.status(200).json(subcategory);
});

// @desc    Delete specific subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});
