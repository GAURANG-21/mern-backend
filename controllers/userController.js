import { StatusCodes } from "http-status-codes";
import UserService from "../services/userService.js";
import AppError from "../utils/appError.js";
const userService = new UserService();

const register = async (req, res) => {
  try {
    const user = await userService.register(req, res);
    if (user["User Already Exists!"])
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User Already Exists",
      });
    else {
      const token = await user.getJWTtoken();
      const options = {
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
        httpOnly: true,
        sameSite: true,
      };
      // console.log("Token received is : ", token);
      return res.status(StatusCodes.OK).cookie("token", token, options).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    }
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: { error },
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: error,
        err: new AppError(
          "Something went wrong",
          "Try finding error in creating user register pathway",
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
      });
  }
};

const login = async (req, res) => {
  try {
    const user = await userService.login(req, res);

    if (user["User doesn't exist"] || user["Password doesn't match"])
      res.status(StatusCodes.UNAUTHORIZED).json({
        DO_NOT_EXIST: user["User doesn't exist"] || null,
        PASSWORD_DOESNT_MATCH: user["Password doesn't match"] || null,
      });
    else {
      const token = await user.getJWTtoken();
      const options = {
        expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 15),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };
      // console.log(token);
      res.status(StatusCodes.ACCEPTED).cookie("token", token, options).json({
        success: true,
        message: "User logged in successfully",
        user,
      });
    }
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: error,
        err: new AppError(
          "Something went wrong",
          "Try finding error in creating user register pathway",
          StatusCodes.INTERNAL_SERVER_ERROR
        ),
      });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    let message;
    message = !token
      ? "You are already logged out!"
      : "Successfully logged out!!";

    res
      .status(StatusCodes.ACCEPTED)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .json({
        success: true,
        message,
      });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Unable to logout user",
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getMyProfile(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: error,
        err: new AppError(
          "Something went wrong",
          "Try finding error in creating user register pathway",
          StatusCodes.EXPECTATION_FAILED
        ),
      });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated_user = await userService.updateProfile(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User updated successfully",
      updated_user,
    });
  } catch (error) {
    if (
      error.message == "Repository Error" ||
      error.message == "Service Error" ||
      error.message == "No changes"
    )
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Something went wrong",
        error: error,
        err: new AppError(
          "Something went wrong",
          "Try finding error in creating user register pathway",
          StatusCodes.CONFLICT
        ),
      });
  }
};

// Forget Password -> set 'ResetToken' and 'ResetTokenExpiry'
//                 -> send Email
//                 -> Receive user

const forgetPassword = async (req, res) => {
  try {
    const user = await userService.forgetPassword(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset link sent successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to send the link",
        err: error,
      });
  }
};

//Reset Password -> Will receive 'ResetPasswordToken' from params and verify by decrpyting.
//               -> Receive a user based on 'ResetPasswordToken' and 'ResetPasswordTokenExpiry'.
//               -> If true, change the password and return the user.

const resetPassword = async (req, res) => {
  try {
    const user = await userService.resetPassword(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error" || error.message == "Service Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to reset the password",
        err: error,
      });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const user = await userService.addToPlaylist(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Added to playlist successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to add to playlist",
        err: error,
      });
  }
};
const removeFromPlaylist = async (req, res) => {
  try {
    const user = await userService.removeFromPlaylist(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Removed from playlist successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to remove from playlist",
        err: error,
      });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const user = await userService.updateProfilePicture(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile Picture updated successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to update profile picture",
        err: error,
      });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to fetch all users",
        err: error,
      });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const user = await userService.changeUserRole(req, res);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to change the user role",
        err: error,
      });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    await userService.deleteMyProfile(req, res);
    res
      .status(StatusCodes.OK)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        maxAge: 0, // Optional: Ensures the cookie is immediately expired
      })
      .json({
        success: true,
        message: "Profile deleted successfully",
      });
  } catch (error) {
    if (error.message == "Repository Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        err: error,
      });
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unable to delete the profile",
        err: error,
      });
  }
};

export {
  register,
  login,
  logout,
  getMyProfile,
  updateProfile,
  forgetPassword,
  resetPassword,
  addToPlaylist,
  removeFromPlaylist,
  updateProfilePicture,
  getAllUsers,
  changeUserRole,
  deleteMyProfile,
};
