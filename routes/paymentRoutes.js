import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { buySubscription } from "../repository/paymentRepository.js";

const router = express.Router();

router.route("/buySubscription").get(isAuthenticated, buySubscription);

export default router;
