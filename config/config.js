import dotenv from "dotenv";
dotenv.config();

const env_variables = {
  PORT: `${process.env.PORT}`,
  MONGO_URI: `${process.env.MONGO_URI}`,
};

export default env_variables;
