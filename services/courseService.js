import { CourseRepository } from "../repository/index.js";
import ServiceError from "../utils/serviceError.js";

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
}

export default courseService;
