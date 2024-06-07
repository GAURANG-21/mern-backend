import express from "express";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  addToPlaylistValidation,
} from "../middlewares/users_validation.js";
import {
  login,
  register,
  logout,
  getMyProfile,
  updateProfile,
  forgetPassword,
  resetPassword,
  addToPlaylist,
  removeFromPlaylist,
  updateProfilePicture,
  getAllUsers,
  changeUserRole,
  deleteMyProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/fileHandle.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/register").post(singleUpload, registerValidation, register);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(logout);
router
  .route("/me")
  .get(isAuthenticated, getMyProfile)
  .delete(isAuthenticated, deleteMyProfile);
router
  .route("/updateProfile")
  .put(isAuthenticated, updateProfileValidation, updateProfile);

//! It is not necessary to authenticate the user.
//! Consider case where at time of login, I forget my password.
//! I will be having no token neither will I be able to access forgetPassword.
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetPassword/:token").put(resetPassword);

router
  .route("/addToPlaylist")
  .post(isAuthenticated, addToPlaylistValidation, addToPlaylist);
router
  .route("/removeFromPlaylist")
  .delete(isAuthenticated, addToPlaylistValidation, removeFromPlaylist);

router
  .route("/updateProfilePicture")
  .put(singleUpload, isAuthenticated, updateProfilePicture);

router.route("/admin/getAllUsers").get(isAuthenticated, isAdmin, getAllUsers);

router
  .route("/admin/user/:id")
  .put(isAuthenticated, isAdmin, changeUserRole)
  .delete();

export default router;
