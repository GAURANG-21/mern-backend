import UserRepository from "../repository/userRepository.js";
import ServiceError from "../utils/serviceError.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(req, res) {
    try {
      const { name, password, email } = req.body;
      const user = await this.userRepository.register(
        { name, email, password },
        res
      );
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new ServiceError("Service Error", "Failed to register user", 500);
    }
  }

  async login(req, res) {
    try {
      const user = await this.userRepository.login(
        {
          email: req.body.email,
          password: req.body.password,
        },
        res
      );

      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else throw new ServiceError("Service Error", "Failed to login user", 401);
    }
  }
}

export default UserService;
