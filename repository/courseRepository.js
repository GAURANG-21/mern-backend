import { StatusCodes } from "http-status-codes";
import { Course } from "../models/Course.js";
import AppError from "../utils/appError.js";
import { dataURIParser } from "../utils/dataURI.js";
import {
  deleteImage,
  deleteVideo,
  uploadImage,
  uploadVideo,
} from "../utils/uploadAndDeleteFiles.js";
import { User } from "../models/User.js";

class courseRepository {
  async getAllCourses(req, res) {
    try {
      const keyword = req.query.keyword || "";
      const category = req.query.category || "";
      const courses = await Course.find({
        title:{
          $regex: keyword,
          $options: "i",
        },
        category:{
          $regex: category,
          $options: "i",
        }
      }).select("-lectures");
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
      // console.log(dataURI);
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

  async deleteCourse(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user_id;

      const course = await Course.findById(courseId);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course not found!",
          StatusCodes.BAD_REQUEST
        );

      const user = await User.findById(userId);
      if (user._id.toString() !== course.createdBy.user_id.toString())
        throw new AppError(
          "Non-Admin",
          "You are not the creator of this course!",
          StatusCodes.CONFLICT
        );

      await deleteImage(course.poster.poster_id);

      course.lectures.forEach(async (element) => {
        await deleteVideo(element.videos.public_id);
      });

      await Course.deleteOne(course._id);
    } catch (error) {
      if (error.message == "Non-Admin" || error.message == "Repository Error")
        throw error;
      throw new AppError(
        "Repository Error",
        "Failed to delete course from repository layer",
        500
      );
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
      console.log(error);
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
      // console.log(dataURI.content)
      const result = await uploadVideo(dataURI.content);

      course.lectures.push({
        title,
        videos: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });

      course.numOfVideos = course.lectures.length;

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

  async deleteCourseLecture(req, res) {
    try {
      const { id: courseId } = req.params;
      const { lectureId } = req.query;
      const userId = req.user_id;

      const course = await Course.findById(courseId);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course not found!",
          StatusCodes.BAD_REQUEST
        );

      if (course.createdBy.user_id !== userId)
        throw new AppError(
          "Non-Admin",
          "You are not the creator of this course",
          StatusCodes.CONFLICT
        );

      const item = course.lectures.find((element) => {
        if (element._id.toString() === lectureId) return element;
      });

      if (!item)
        throw new AppError(
          "Repository Error",
          "Lecture not found!",
          StatusCodes.BAD_REQUEST
        );

      await deleteVideo(item.videos.public_id);

      course.lectures = course.lectures.filter((item) => {
        if (item._id.toString() !== lectureId) return item;
      });

      course.numOfVideos = course.lectures.length;
      await course.save();

      return course;
    } catch (error) {
      if (error.message == "Repository Error" || "Non-Admin") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Unable to delete lecture",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }
}

export default courseRepository;
