import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  buySubscription,
  cancelSubscription,
  getRazorpayApiKey,
  paymentVerification,
} from "../repository/paymentRepository.js";

const router = express.Router();

router.route("/buySubscription").get(isAuthenticated, buySubscription);

router.route("/paymentVerification").post(isAuthenticated, paymentVerification);

router.route("/getRazorpayApikey").get(getRazorpayApiKey);

router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
