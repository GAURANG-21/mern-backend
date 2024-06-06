import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import AppError from "../utils/appError.js";

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user_id);
  if (!user)
    throw new AppError(
      "Validation Error",
      "User not found!",
      StatusCodes.BAD_REQUEST
    );

  if (user.role === "user")
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Non-Admin",
      explaination: "Only Admins are allowed to create a course!",
    });
  else next();
};
