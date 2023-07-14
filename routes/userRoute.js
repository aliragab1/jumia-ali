const express = require("express");
const {
  getUsers,
  createuser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} = require("../services/userService");
const { uploadSingleFile } = require("../middlewares/uploadImageMiddleware");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");
const authService = require("../services/authService");

const router = express.Router();

// Admin
// router.use(authService.allowedTo("admin", "manager"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin"), getUsers)
  .post(
    authService.protect,
    // authService.allowedTo("admin"),
    uploadSingleFile("profileImg", "users"),
    createUserValidator,
    createuser
  );
router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadSingleFile("profileImg", "users"),
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
