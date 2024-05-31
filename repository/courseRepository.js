import { StatusCodes } from "http-status-codes";
import { Course } from "../models/Course.js";
import AppError from "../utils/appError.js";

class courseRepository {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find().select("-lectures");
      return courses;
    } catch (error) {
      throw new AppError(
        "Repository Error",
        "Failed to retrieve all courses from repository layer",
        500
      );
    }
  }

  async createCourse(obj, res) {
    try {
      await Course.create(obj);
      return "Course created successfully";
    } catch (error) {
      throw new AppError("Repository Error", error.errors.description, 500);
    }
  }
}

export default courseRepository;
