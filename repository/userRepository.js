import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import AppError from "../utils/appError.js";
import { sendEmail } from "../middlewares/sendEmail.js";
import crypto from "crypto";
import { dataURIParser } from "../utils/dataURI.js";
import { deleteImage, uploadImage } from "../utils/uploadAndDeleteFiles.js";

class UserRepository {
  async register(req, res) {
    try {
      const { email, file } = req;
      const user = await User.findOne({ email });
      if (user) return { "User Already Exists!": user };
      const dataURI = await dataURIParser(file);
      const result = await uploadImage(dataURI.content);

      delete req.file;

      const create_user = await User.create({
        ...req,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
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
      if (req.body.name == user.name || req.body.email == user.email) {
        throw new AppError(
          "No changes",
          "No changes provided in user details",
          StatusCodes.CONFLICT
        );
      } else {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        await user.save();
        return user;
      }
    } catch (error) {
      if (error.message == "No changes") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Couldn't update the profile",
          StatusCodes.CONFLICT
        );
    }
  }

  async forgetPassword(req, res) {
    try {
      console.log(req);
      const user = await User.findOne({ email: req });
      if (!user)
        throw new AppError(
          "Repository Error",
          "No such user with email id found!",
          StatusCodes.BAD_REQUEST
        );
      const resetToken = await user.getResetToken();
      await user.save();

      const url = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
      const message = `Please reset your password using the url ${url}. If it wasn't you, please ignore.`;

      await sendEmail(req, "Change your CourseUp Password", message);
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Something went wrong while sending reset password link",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, updatedPassword } = req;
      const ResetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await User.findOne({
        ResetPasswordToken,
        ResetPasswordExpire: { $gt: Date.now() },
      }).select("+password");

      user.password = updatedPassword;
      user.ResetPasswordToken = undefined;
      user.ResetPasswordExpire = undefined;
      await user.save();

      return user;
    } catch (error) {
      throw new AppError(
        "Repository Error",
        "Invalid or expired token. Please try again",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  async addToPlaylist(req, res) {
    try {
      const user = await User.findById(req.user_id);
      if (!user)
        throw new AppError(
          "Repository Error",
          "User not found!",
          StatusCodes.BAD_REQUEST
        );

      const course = await Course.findById(req.body.id);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course not found!",
          StatusCodes.BAD_REQUEST
        );

      const inPlaylist = user.playlist.find((currentValue) => {
        if (currentValue.course.toString() === course._id.toString())
          return true;
      });

      if (inPlaylist)
        throw new AppError(
          "Repository Error",
          "Already In playlist",
          StatusCodes.BAD_REQUEST
        );

      user.playlist.push({
        course: course._id,
        poster: course.poster.url,
      });

      await user.save();

      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Unable to add the course to playlist",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async removeFromPlaylist(req, res) {
    try {
      const user = await User.findById(req.user_id);
      if (!user)
        throw new AppError(
          "Repository Error",
          "User not found!",
          StatusCodes.BAD_REQUEST
        );

      const course = await Course.findById(req.body.id);
      if (!course)
        throw new AppError(
          "Repository Error",
          "Course not found!",
          StatusCodes.BAD_REQUEST
        );

      const newPlaylist = user.playlist.filter((item) => {
        if (item.course.toString() !== course._id.toString()) return item;
      });

      user.playlist = newPlaylist;
      await user.save();
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Unable to remove the course from playlist",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async updateProfilePicture(req, res) {
    try {
      const user = await User.findById(req.user_id);
      if (!user)
        throw new AppError(
          "Repository Error",
          "User not found!",
          StatusCodes.BAD_REQUEST
        );

      const file = req.file;
      if (!file)
        throw new AppError(
          "Repository Error",
          "No file uploaded",
          StatusCodes.BAD_REQUEST
        );

      await deleteImage(user.avatar.public_id);
      const dataURI = await dataURIParser(file);
      const result = await uploadImage(dataURI.content);

      user.avatar.public_id = result.public_id;
      user.avatar.url = result.secure_url;

      await user.save();

      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        return new AppError(
          "Repository Error",
          "Unable to update profile picture",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-User.findOne(req.user_id)");
      return users;
    } catch (error) {
      throw new AppError(
        "Repository Error",
        "Unable to fetch all users",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changeUserRole(req, res) {
    try {
      const user_id = req.params.id;
      const user = await User.findById(user_id);
      if (!user)
        throw new AppError(
          "Repository Error",
          "User not found",
          StatusCodes.BAD_REQUEST
        );

      if (user.role === "admin") user.role = "user";
      else user.role = "admin";

      await user.save();

      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      else
        throw new AppError(
          "Repository Error",
          "Unable to change user role",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async deleteMyProfile(req, res) {
    try {
      const user = await User.findById(req.user_id);

      await deleteImage(user.avatar.public_id);
      await user.deleteOne({ _id: req.user_id });
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Repository Error",
        "Unable to delete the profile",
        StatusCodes.BAD_REQUEST
      );
    }
  }
}

export default UserRepository;
