import { StatusCodes } from "http-status-codes";
import ValidationError from "../utils/validationError.js";

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

export { registerValidation };
