require("dotenv").config();

const { APP_PORT, MONGO_URL } = process.env;
const SUCCESS_STATUS_CODE = 200;
const CREATE_STATUS_CODE = 201;
const BAD_REQUEST_STATUS_CODE = 400;
const SERVER_ERROR_STATUS_CODE = 500;
const NOT_FOUND_STATUS_CODE = 404;
const ACCEPTED_STATUS_CODE = 202;
const SALT_ROUNDS = 10;

module.exports = {
  SUCCESS_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  ACCEPTED_STATUS_CODE,
  APP_PORT,
  MONGO_URL,
  SALT_ROUNDS,
};
