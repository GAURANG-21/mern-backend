import { Course } from "../models/Course.js";
import AppError from "../utils/appError.js";

class courseRepository {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find();
      return courses;
    } catch (error) {
      throw new AppError(
        "Repository Error",
        "Failed to retrieve all courses from repository layer",
        500
      );
    }
  }
}

export default courseRepository;
