import express from "express";
import "dotenv/config";
import dbConnect from "./config/dbConnect";
import logger from "./utils/logger";

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  /*  console.log(`Server is running on port ${PORT}`); */
  logger.info(`Server is running on port ${PORT}`);

  await dbConnect();
});
