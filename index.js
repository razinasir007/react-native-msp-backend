const express = require("express");
const { APP_PORT } = require("./config");
const bodyParser = require("body-parser");
const { connectToMongoDB } = require("./config/dbConnection");
const cors = require("cors");
const router = require("./routes");

connectToMongoDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`The app is running on port ${APP_PORT}`);
});

app.use("/api", router);

app.listen(APP_PORT || 8000, () => {
  console.log(`The app is running on port ${APP_PORT}`);
});
