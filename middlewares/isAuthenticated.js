// * It is used to verify that the user is logged In or not. It will return user id aka token
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Please login to access this route",
      err: new AppError(
        "Authentication Error",
        "LogIn Required",
        StatusCodes.UNAUTHORIZED
      ),
    });
  else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user_id = decoded.id;
    next();
  }
};

export { isAuthenticated };
