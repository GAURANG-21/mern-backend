import { User } from "../models/User.js";
import { instance } from "../index.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/appError.js";

export const buySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user)
      throw new AppError(
        "Payment Repository Error",
        "User not found!",
        StatusCodes.BAD_REQUEST
      );

    if (user.role === "admin")
      throw new AppError(
        "Payment Repository Error",
        "Admins can access the courses without subscription",
        StatusCodes.BAD_REQUEST
      );

    const subscription = await instance.subscriptions.create({
      plan_id: process.env.PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });
    // console.log(subscription);
    if (subscription.error)
      throw new AppError(
        "Razorpay Error",
        "Look the documentation",
        StatusCodes.BAD_REQUEST
      );

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save();
    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "Subscription created successfully",
      subscription: subscription.id,
    });
  } catch (error) {
    console.log(error);
    if (error.message == "Payment Repository Error" || "Razorpay Error")
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    else
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Unable to create a subscription",
        err: { error },
      });
  }
};
