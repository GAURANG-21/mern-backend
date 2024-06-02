import express from "express";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/users_validation.js";
import {
  login,
  register,
  logout,
  getMyProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(registerValidation, register);
router.route("/login").post(loginValidation, login);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated, getMyProfile);

export default router;
