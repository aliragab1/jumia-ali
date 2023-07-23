const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  private
exports.getUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 15;
  const skip = (page - 1) * limit;

  const totalUsers = await userModel.countDocuments();
  const Users = await userModel.find({}).skip(skip).limit(limit);
  
  res.status(200).json({
    results: Users.length,
    page,
    totalUsers,
    data: Users,
  });
});


// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  private
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const User = await userModel.findById(id);
  if (!User) {
    return next(new ApiError(`No User for this id ${id}`, 404));
  }
  res.status(200).json({ data: User });
});

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private

exports.createuser = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.profileImg = req.file?.filename;
  let user = new userModel(req.body);
  await user.save();
  res.status(201).json({ data: user });
});

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  // const { id } = req.params;
  // if (req.body.name) {
  //   req.body.slug = slugify(req.body.name);
  // }
  // req.body.profileImg = req.file?.filename;
  let user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${id}`, 400));
  }
  res.status(200).json({ data: user });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id);

  if (!user) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No user for this id ${id}`, 404));
  }
  res.status(204).send();
});
