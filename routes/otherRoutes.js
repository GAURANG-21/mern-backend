import express from "express";
import { contact, getDashboardStats, requestCourse } from "../repository/otherRepository.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Contact form
router.route("/contact").post(contact);

//Request form
router.route("/courseRequest").post(requestCourse);

//Admin stats
router.route("/admin/stats").get(isAuthenticated, isAdmin, getDashboardStats);

export default router;
