import express from "express";
import {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addCourseLectures,
  deleteCourse,
  deleteCourseLecture,
} from "../controllers/courseController.js";
import { createCourseValidation } from "../middlewares/courses_validation.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/fileHandle.js";
import { isSubscriberValidation } from "../middlewares/users_validation.js";

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
  .route("/deleteCourse/:courseId")
  .delete(isAuthenticated, isAdmin, deleteCourse);

router
  .route("/course/:id")
  .get(isAuthenticated, isSubscriberValidation, getCourseLectures)
  .post(singleUpload, isAuthenticated, isAdmin, addCourseLectures)
  .delete(isAuthenticated, isAdmin, deleteCourseLecture);

export default router;
