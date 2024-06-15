import express from "express";
import bodyParser from "body-parser";
import config from "./config/config.js";
import routerCourse from "./routes/courseRoutes.js";
import routerUser from "./routes/userRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import otherRoute from "./routes/otherRoutes.js";
import { connectDB, disconnectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

//* Making successful connection with database
connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", routerCourse);
app.use("/api/v1", routerUser);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", otherRoute);

app.listen(config.PORT, () => {
  console.log(`Server is running at port ${config.PORT}`);
});

//* Graceful disconnection
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
