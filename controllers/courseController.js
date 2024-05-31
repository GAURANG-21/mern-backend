import AppError from "../utils/appError.js";
import { CourseService } from "../services/index.js";
import { StatusCodes } from "http-status-codes";
const courseService = new CourseService();

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses(req, res);
    res.status(200).json({
      success: true,
      message: "Everything is working fine at basic level.",
      courses,
    });
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: { error },
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: new AppError(
          "Try finding error in getting all courses pathway",
          "Unable to fetch all courses",
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
      });
  }
};

const createCourse = async (req, res) => {
  try {
    await courseService.createCourse(req, res);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Course created successfully",
      err: {},
    });
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: { error },
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to create course",
        error: new AppError(
          "Something went wrong",
          "Try finding error in creating course pathway",
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
      });
  }
};

export default {
  getAllCourses,
  createCourse,
};
