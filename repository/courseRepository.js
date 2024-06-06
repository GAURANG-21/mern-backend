import { StatusCodes } from "http-status-codes";
import { Course } from "../models/Course.js";
import AppError from "../utils/appError.js";
import { dataURIParser } from "../utils/dataURI.js";
import { uploadImage } from "../utils/uploadAndDeleteFiles.js";

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
      const dataURI = await dataURIParser(obj.file);
      console.log(dataURI);
      const result = await uploadImage(dataURI.content);
      obj.poster = {
        url: result.secure_url,
        poster_id: result.public_id,
      };
      delete obj.file;
      await Course.create(obj);
      return "Course created successfully";
    } catch (error) {
      console.log(error);
      throw new AppError("Repository Error", error.errors.description, 500);
    }
  }

  async getCourseLectures(req, res) {
    try {
      const course = await Course.findById(req);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course not found",
          StatusCodes.BAD_REQUEST
        );
      course.views += 1;
      await course.save();
      return course.lectures;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new AppError(
        "Repository Error",
        "Failed to retrieve lectures from repository layer",
        500
      );
    }
  }

  async addCourseLectures(req, res) {
    try {
      const { user_id, course_id, title, file } = req;
      const course = await Course.findById(course_id);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course Not Found",
          StatusCodes.BAD_REQUEST
        );

      //! To ensure that the creator of the course can ONLY add lectures to it. Other ADMIN users can't.
      if (user_id !== course.createdBy.user_id)
        throw new AppError(
          "Repository Error",
          "You are not the creator of this course",
          StatusCodes.CONFLICT
        );

      const dataURI = await dataURIParser(file);

      const result = await uploadImage(dataURI.content);

      course.lectures.push({
        title,
        videos: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
      await course.save();
      return course;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new AppError(
        "Repository Error",
        "Cannot add lecture to course",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default courseRepository;
