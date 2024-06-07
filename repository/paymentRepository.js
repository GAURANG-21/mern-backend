import { User } from "../models/User.js";
import { instance } from "../index.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

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

export const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const user = await User.findById(req.user_id);

    if (!user)
      throw new AppError(
        "Payment Repository Error",
        "User not found!",
        StatusCodes.BAD_REQUEST
      );

    const subscription_id = user.subscription.id;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(subscription_id + "|" + razorpay_payment_id, "utf-8")
      .digest("hex");

    if (generatedSignature !== razorpay_signature)
      res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";
    await user.save();
    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Payment Verification failed",
      err: { error },
    });
  }
};

export const getRazorpayApiKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_API_KEY });
};
