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
    console.log(req.body);
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

const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req, res);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    if (error.message == "Repository Error" || "Non-Admin")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        explaination: error.explaination,
        err: error,
      });
    else
      res.status(Status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to delete the course",
      });
  }
};

const getCourseLectures = async (req, res) => {
  try {
    const lectures = await courseService.getCourseLectures(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "All lectures fetched successfully",
      data: lectures,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to fetch lectures",
        error: new AppError(
          "Something went wrong",
          "Try finding error in fetching lectures",
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
      });
  }
};

const addCourseLectures = async (req, res) => {
  try {
    const course = await courseService.addCourseLectures(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Lectures added successfully",
      data: course,
    });
  } catch (error) {
    if (
      error.message == "Repository Error" ||
      "Service Error" ||
      "Validation Error"
    )
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to add lectures",
        err: error,
      });
  }
};

const deleteCourseLecture = async (req, res) => {
  try {
    const course = await courseService.deleteCourseLecture(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Lecture deleted successfully",
      course,
    });
  } catch (error) {
    if (error.message == "Repository Error" || "Non-Admin")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        explaination: error.explaination,
        err: error,
      });
    else
      res.status(Status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to delete lecture in the course",
      });
  }
};

export {
  getAllCourses,
  createCourse,
  deleteCourse,
  getCourseLectures,
  addCourseLectures,
  deleteCourseLecture,
};
