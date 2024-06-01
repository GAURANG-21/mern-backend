import mongoose, { Schema } from "mongoose";
import validator from "email-validator";
import jwt from "jsonwebtoken";

const user_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email."],
    unique: true,
    validate: {
      validator: validator.validate,
      message: "Please enter a valid email address."
    },
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: [6, "Create password of atleast 6 characters."],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  //*To be taken from RazorPay
  subscription: {
    id: String,
    status: String,
  },
  //*Just like youtube play list. It has array of courses.
  //*Playlist --> Courses --> Lectures̥
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  ResetPasswordToken: String,
  ResetPasswordExpire: String,
});

user_schema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
};
const User = await mongoose.model("User", user_schema);
export { User };
