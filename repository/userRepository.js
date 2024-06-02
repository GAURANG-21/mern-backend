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

  async login(req, res) {
    try {
      const { email, password } = req;
      const user = await User.findOne({ email }).select("+password");
      if (!user)
        return {
          "User doesn't exist": new AppError(
            "Repository Error",
            "User doesn't exist",
            StatusCodes.UNAUTHORIZED
          ),
        };

      const password_Verification = await user.comparePasswords(password);
      if (!password_Verification)
        return {
          "Password doesn't match": new AppError(
            "Repository Error",
            "Password doesn't match",
            StatusCodes.UNAUTHORIZED
          ),
        };

      return user;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Repository Error",
        "There is an error in the repository layer",
        StatusCodes.BAD_GATEWAY
      );
    }
  }

  async getMyProfile(req, res) {
    try {
      const user = await User.findById(req).select("+password");
      return user;
    } catch (error) {
      throw new AppError(
        "Repository Error",
        "Unable to fetch user's profile",
        StatusCodes.EXPECTATION_FAILED
      );
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await User.findById(req.user_id);
      if (req.body.name == user.name || req.body.email == user.email)
        {
          throw new AppError(
          "No changes",
          "No changes provided in user details",
          StatusCodes.CONFLICT
        );
      }
      else {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        await user.save();
        return user;
      }
    } catch (error) {
      if(error.message == "No changes") throw error;
      else
      throw new AppError(
        "Repository Error",
        "Couldn't update the profile",
        StatusCodes.CONFLICT
      );
    }
  }
}

export default UserRepository;
