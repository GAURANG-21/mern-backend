import express from 'express'
import {courseController} from '../controllers/index.js'
import {createCourseValidation} from '../middlewares/courses_validation.js'

const router = express.Router();
router.route('/getAllCourses').get(courseController.getAllCourses);
router.route('/createCourse').post(createCourseValidation,courseController.createCourse);

export default router