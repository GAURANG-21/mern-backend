import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  buySubscription,
  getRazorpayApiKey,
  paymentVerification,
} from "../repository/paymentRepository.js";

const router = express.Router();

router.route("/buySubscription").get(isAuthenticated, buySubscription);

router.route("/paymentVerification").post(isAuthenticated, paymentVerification);

router.route("/getRazorpayApikey").get(getRazorpayApiKey);

export default router;
