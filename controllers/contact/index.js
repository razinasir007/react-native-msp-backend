const { validationResult } = require("express-validator");
const {
  SUCCESS_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  SALT_ROUNDS,
} = require("../../config");
const Contact = require("../../models/contacts");
const bcrypt = require("bcrypt");
const { logger } = require("../../logger");

const AddContactController = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send({
        status: BAD_REQUEST_STATUS_CODE,
        message: "Contact input validation error",
        errors: errors.array(),
      });
    }
    const { body } = req;
   
    const newContactDetails = await Contact.create({
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phonenumber: body.phonenumber,
      mailaddress: body.mailaddress,
      billingaddress: body.billingaddress,
    });

    if (newContactDetails) {
      logger.info(
        `Contact LOG - Status: ${CREATE_STATUS_CODE} - Message: Contact created successfully`
      );
      return res
        .status(CREATE_STATUS_CODE)
        .json({ message: "Contact created successfully", data: newContactDetails });
    } else {
      return res.send({
        status: SERVER_ERROR_STATUS_CODE,
        message: "Unable to create contact in DB",
        errors: errors.array(),
      });
    }
  } catch (error) {
    logger.error(
      `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
    );
  }
};


const GetContactsController = async (req, res) => {
  try {
    // exclude password, version, and createdAt timestamp
    const allContacts = await Contact.find()

    if (allContacts) {
      if (allContacts.length > 0) {
        logger.info(
          `GET Contacts LOG - Status: ${SUCCESS_STATUS_CODE} - Message: Get all Contacts executed`
        );

        return res
          .status(SUCCESS_STATUS_CODE)
          .json({ message: "Fetched all Contacts", data: allContacts });
      } else {
        throw {
          status: NOT_FOUND_STATUS_CODE,
          message: "No Contacts found.",
        };
      }
    } else {
      throw {
        status: SERVER_ERROR_STATUS_CODE,
        message: "Unable to get all Contacts from DB",
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

module.exports = { AddContactController, GetContactsController };
