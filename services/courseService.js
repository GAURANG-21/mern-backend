import { StatusCodes } from "http-status-codes";
import { CourseRepository } from "../repository/index.js";
import ServiceError from "../utils/serviceError.js";
import { User } from "../models/User.js";

class courseService {
  constructor() {
    this.courseRepository = new CourseRepository();
  }

  async getAllCourses(req, res) {
    try {
      const courses = await this.courseRepository.getAllCourses(req, res);
      return courses;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new ServiceError(
        "Service Error",
        "Failed to retrieve courses",
        500
      );
    }
  }

  async createCourse(req, res) {
    try {
      const { title, description, category, createdBy } = req.body;
      const file = req.file;
      const createCourse = await this.courseRepository.createCourse(
        {
          title,
          description,
          category,
          createdBy: {
            user_id: req.user_id,
            createdBy: createdBy,
          },
          file,
        },
        res
      );
      return createCourse;
    } catch (error) {
      console.log(error);
      if (error.message == "Repository Error") throw error;
      throw new ServiceError("Service Error", "Failed to create course", 500);
    }
  }

  async getCourseLectures(req, res) {
    try {
      const course_id = req.params;
      const lectures = await this.courseRepository.getAllLectures(
        course_id,
        res
      );
      return lectures;
    } catch (error) {
      throw error;
    }
  }

  async addCourseLectures(req, res) {
    try {
      const user_id = req.user_id;
      const course_id = req.params.id;
      const { title } = req.body;
      const file = req.file;
      // console.log("User ID", user_id,"\nCourse ID", course_id, "\nTITLE", title, "\nFILE", file);
      if (!title || !file)
        throw new ServiceError(
          "Validation Error",
          "File or title missing",
          StatusCodes.BAD_REQUEST
        );
      const course = await this.courseRepository.addCourseLectures(
        { user_id, course_id, title, file },
        res
      );
      return course;
    } catch (error) {
      if (
        error.message == "Validation Error" ||
        error.message == "Repository Error"
      )
        throw error;
      else throw new ServiceError();
    }
  }
}

export default courseService;
