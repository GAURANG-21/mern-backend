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

  async updateProfile(req, res) {
    try {
      const updated_user = await this.userRepository.updateProfile(req, res);
      return updated_user;
    } catch (error) {
      if (error.message == "Repository Error" || error.message == "No changes")
        throw error;
      throw new ServiceError(
        "Service Error",
        "Failed to update user profile",
        StatusCodes.CONFLICT
      );
    }
  }

  // async forgetPassword(req, res){
  //   try {
  //     const {token} = req.user_id;
  //     const user = await this.userRepository.forgetPassword({token: token, email: req.body.email}, res);
  //     return user;
  //   } catch (error) {
  //     if(error.message == "Repository Error") throw error;
  //     throw ServiceError(
  //       "Service Error",
  //       "Email didn't work",
  //       StatusCodes.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // async resetPassword(req, res){
  //   try {
  //     const user = await this.userRepository.resetPassword(req, res);
  //     return user;
  //   } catch (error) {
  //     if(error.message == "Repository Error") throw error;
  //     throw ServiceError(
  //       "Service Error",
  //       "Email didn't work",
  //       StatusCodes.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        throw new AppError(
          "Service Error",
          "Email not found",
          StatusCodes.BAD_REQUEST
        );
      const user = await this.userRepository.forgetPassword(email, res);
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        throw new ServiceError(
          "Service Error",
          "Failed to send password reset email",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { updatedPassword } = req.body;
      if (!updatedPassword)
        throw new AppError(
          "Service Error",
          "New password not found",
          StatusCodes.BAD_REQUEST
        );
      const user = await this.userRepository.resetPassword(
        { token, updatedPassword },
        res
      );
      return user;
    } catch (error) {
      if (
        error.message == "Repository Error" ||
        error.message == "Service Error"
      )
        throw error;
      throw new ServiceError(
        "Service Error",
        "Failed to reset password",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default UserService;
