import { StatusCodes } from "http-status-codes";
import UserService from "../services/userService.js";
import AppError from "../utils/appError.js";
const userService = new UserService();

const register = async (req, res) => {
  try {
    const user = await userService.register(req, res);
    if (user["User Already Exists!"])
      res.status(StatusCodes.OK).json({
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
      console.log("Token received is : ", token);
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

export { register };
