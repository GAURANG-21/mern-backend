import mongoose, { Schema } from "mongoose";
import validator from "email-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from 'crypto'

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
      message: "Please enter a valid email address.",
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

user_schema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};


user_schema.methods.getResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.ResetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.ResetPasswordExpire = Date.now() + 1000*60*15; // 15 minutes
  return resetToken;
}

// * Before saving the passwords to the datasave, hash them.
// ! Not necessary to create a instance method for this.

user_schema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hashSync(this.password, 10);
});

const User = await mongoose.model("User", user_schema);
export { User };
