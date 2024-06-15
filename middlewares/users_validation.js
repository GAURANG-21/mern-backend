import { StatusCodes } from "http-status-codes";
import ValidationError from "../utils/validationError.js";
import { User } from "../models/User.js";

const registerValidation = (req, res, next) => {
  const { name, email, password } = req.body;
  const avatar = {
    public_id: "abcd",
    url: "xyz",
  };
  if (!name || !email || !password || !avatar)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Please fill out all fields",
      err: new ValidationError(
        "Validation Error",
        "Please fill out all fields",
        StatusCodes.BAD_REQUEST
      ),
    });
  else next();
};

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Please fill out all fields",
      err: new ValidationError(
        "Validation Error",
        "Please fill out all fields",
        StatusCodes.BAD_REQUEST
      ),
    });
  else next();
};

const updateProfileValidation = (req, res, next) => {
  const { email, name } = req.body;
  if (!email && !name)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Please fill out all fields",
      err: new ValidationError(
        "Validation Error",
        "Please fill out all fields",
        StatusCodes.BAD_REQUEST
      ),
    });
  else next();
};

const addToPlaylistValidation = (req, res, next) => {
  const { id } = req.body;
  if (!id)
    res.status(StatusCodes.BAD_GATEWAY).json({
      success: false,
      message: "Please provide course_id",
      err: new ValidationError(
        "Validation Error",
        "Please provide course_id",
        StatusCodes.BAD_GATEWAY
      ),
    });
  else next();
};

const isSubscriberValidation = async (req, res, next) => {
  const user = await User.findById(req.user_id);
  if (user.subscription.status !== "active" && user.role !== "admin")
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "You are not subscribed",
      err: new ValidationError(
        "Validation Error",
        "You are neither admin nor a subscriber",
        StatusCodes.BAD_REQUEST
      ),
    });
  else next();
};

export {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  addToPlaylistValidation,
  isSubscriberValidation,
};
