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
import nodecron from "node-cron";
import { Stats } from "./models/Stats.js";
import cors from "cors";

//* Making successful connection with database
connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", routerCourse);
app.use("/api/v1", routerUser);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", otherRoute);

nodecron.schedule("0 0 0 1 * *", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

app.listen(config.PORT, () => {
  console.log(`Server is running at port ${config.PORT}`);
});

app.get("/", (req, res) =>
  res.send(
    `<h1>Server is working!. Click on the <a href=${process.env.FRONTEND_URL}>link</a> to visit frontend.</h1>`
  )
);

//* Graceful disconnection
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
