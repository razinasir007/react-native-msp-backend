const mongoose = require("mongoose");
const { MONGO_URL } = require("./index");
const { logger } = require("../logger.js");

const connectToMongoDB = async () => {
  await mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info("MONGO DB CONNECTED");
    })
    .catch((error) => {
      console.error("Error while connecting", error);
    });
};

module.exports = { connectToMongoDB };
