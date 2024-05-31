import {CourseService} from '../services/index.js'
const courseService = new CourseService();

const getAllCourses= async(req, res)=>{
    try {
        const courses = await courseService.getAllCourses(req, res);
        res.status(200).json({
            message: "Everything is working fine at basic level.",
            description: courses
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export default {
    getAllCourses
}