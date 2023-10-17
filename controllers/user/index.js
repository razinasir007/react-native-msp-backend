const { validationResult } = require("express-validator");
const {
  SUCCESS_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  SALT_ROUNDS,
} = require("../../config");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const { logger } = require("../../logger");

const AddUserController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({
        status: BAD_REQUEST_STATUS_CODE,
        message: "User input validation error",
        errors: errors.array(),
      });
    }
    const { body } = req;
    const hashedPassword = await bcrypt.hash(
      body.password.toString(),
      SALT_ROUNDS
    );
    const newUserDetails = await User.create({
      email: body.email,
      password: hashedPassword,
    });

    if (newUserDetails) {
      logger.info(
        `USER LOG - Status: ${CREATE_STATUS_CODE} - Message: User created successfully`
      );
      return res
        .status(CREATE_STATUS_CODE)
        .json({ message: "User created successfully", data: newUserDetails });
    } else {
      return res.send({
        status: SERVER_ERROR_STATUS_CODE,
        message: "Unable to create user in DB",
        errors: errors.array(),
      });
    }
  } catch (error) {
    logger.error(
      `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
    );
    if (error.code === 11000) {
      // Handle the duplicate key error (for MongoDB, code 11000 is for duplicate key errors)
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        status: BAD_REQUEST_STATUS_CODE,
        message: "Duplicate user. This user already exists.",
      });
    } else {
      logger.error(
        `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
      );
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        status: BAD_REQUEST_STATUS_CODE,
        message: "Unable to create user in DB",
        errors: errors.array(),
      });
    }
  }
};

const LoginUser = async (req, res) => {

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({
        status: BAD_REQUEST_STATUS_CODE,
        message: "User input validation error",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        status: BAD_REQUEST_STATUS_CODE,
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        status: BAD_REQUEST_STATUS_CODE,
        message: "Invalid Password",
      });
    }

    return res.status(SUCCESS_STATUS_CODE).json({
      status: SUCCESS_STATUS_CODE,
      message: "User Looged In Successfully",
      data: true
    });


  }
  catch (err) {
    console.log("error", err)

  }
}

const GetUserController = async (req, res) => {
  try {
    // exclude password, version, and createdAt timestamp
    const allUsers = await User.find().select("-password -__v -createdAt");

    if (allUsers) {
      if (allUsers.length > 0) {
        logger.info(
          `GET USERS LOG - Status: ${SUCCESS_STATUS_CODE} - Message: Get all users executed`
        );

        return res
          .status(SUCCESS_STATUS_CODE)
          .json({ message: "Fetched all users", data: allUsers });
      } else {
        throw {
          status: NOT_FOUND_STATUS_CODE,
          message: "No users found.",
        };
      }
    } else {
      throw {
        status: SERVER_ERROR_STATUS_CODE,
        message: "Unable to get all users from DB",
      };
    }
  } catch (error) {
    logger.error(
      `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
    );
    return res
      .status(error.status)
      .json({ message: error.message, errors: error?.errors });
  }
};

module.exports = { AddUserController, GetUserController, LoginUser };
