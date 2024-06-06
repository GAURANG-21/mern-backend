import { StatusCodes } from "http-status-codes";
import ValidationError from "../utils/validationError.js";

const createCourseValidation = (req, res, next) => {
  const { title, description, createdBy, category } = req.body;
  const file = req.file;
  // console.log(file)
  if (!title || !description || !createdBy || !category || !file)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      err: new ValidationError(
        "Validation Error",
        "Please fill out all the fields",
        StatusCodes.BAD_REQUEST
      ),
    });
  else next();
};

export { createCourseValidation };
