import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import AppError from "../utils/appError.js";

class UserRepository {
  async register(req, res) {
    try {
      const { email } = req;
      const user = await User.findOne({ email });
      if (user) return { "User Already Exists!": user };
      const create_user = await User.create({
        ...req,
        avatar: {
          public_id: "abcde",
          url: "xyza",
        },
      });
      return create_user;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Repository Error",
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default UserRepository;
