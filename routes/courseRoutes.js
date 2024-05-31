import express from 'express'
import {courseController} from '../controllers/index.js'

const router = express.Router();
router.route('/getAllCourses').get(courseController.getAllCourses);

export default router