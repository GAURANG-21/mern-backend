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
  resetPassword
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerValidation, register);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/updateProfile").put(isAuthenticated, updateProfileValidation, updateProfile);
router.route("/forgetPassword").post(isAuthenticated, forgetPassword)
router.route("/resetPassword/:token").put(isAuthenticated, resetPassword)

export default router;
