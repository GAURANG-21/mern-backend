import express from "express";
import bodyParser from "body-parser";
import config from "./config/config.js";
import router from "./routes/courseRoutes.js";
import { connectDB } from "./config/database.js";

//* Making successful connection with database
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.listen(config.PORT, () => {
  console.log(`Server is running at port ${config.PORT}`);
});

//* Graceful disconnection
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
