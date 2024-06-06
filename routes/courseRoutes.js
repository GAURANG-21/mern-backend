import express from "express";
import {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addCourseLectures,
} from "../controllers/courseController.js";
import { createCourseValidation } from "../middlewares/courses_validation.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/fileHandle.js";

const router = express.Router();
router.route("/getAllCourses").get(getAllCourses);
router
  .route("/createCourse")
  .post(
    singleUpload,
    createCourseValidation,
    isAuthenticated,
    isAdmin,
    createCourse
  );

router
  .route("/course/:id")
  .get(isAuthenticated, getCourseLectures)
  .post(singleUpload, isAuthenticated, isAdmin, addCourseLectures);

export default router;
