import { StatusCodes } from "http-status-codes";
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

  async getMyProfile(req, res) {
    try {
      const user_id = req.user_id;
      const user = await this.userRepository.getMyProfile(user_id, res);
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new ServiceError(
        "Service Error",
        "Service layer issue",
        StatusCodes.EXPECTATION_FAILED
      );
    }
  }
}

export default UserService;
