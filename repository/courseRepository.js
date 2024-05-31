
class courseRepository{
    async getAllCourses(req, res){
        try {
            console.log("Repository working properly.")
            return "Success"
        } catch (error) {
            console.log("Error in repository layer");
            throw {error}
        }
    }
}


export default courseRepository