import {CourseRepository} from '../repository/index.js'


class courseService{
    constructor(){
        this.courseRepository = new CourseRepository();
    }

    async getAllCourses(req, res){
        try {
            console.log("Service layer is working fine")
            const courses = await this.courseRepository.getAllCourses(req, res);
            return courses;
        } catch (error) {
            console.log("Error in the service layer")
            throw {error}
        }
    }
}

export default courseService