import express from "express";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from "../middlewares/users_validation.js";
import {
  login,
  register,
  logout,
  getMyProfile,
  updateProfile,
  forgetPassword,
  resetPassword,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerValidation, register);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
router
  .route("/updateProfile")
  .put(isAuthenticated, updateProfileValidation, updateProfile);

//! It is not necessary to authenticate the user.
//! Consider case where at time of login, I forget my password.
//! I will be having no token neither will I be able to access forgetPassword.
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetPassword/:token").put(resetPassword);

export default router;
