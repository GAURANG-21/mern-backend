import express from "express";
import bodyParser from "body-parser";
import config from "./config/config.js";
import router from "./routes/courseRoutes.js";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.listen(config.PORT, () => {
  console.log(`Server is running at port ${config.PORT}`);
});
