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
const stripe = require('stripe')('sk_test_51O2U89GwK3f7CfwDJYHbVO00JpanLIDjsiuFjPUb1GUIVY1yQBhYAfJ53TQjWHDnmpxm1YojFsmMdTtsKkd3CuK300ov0rDXWR')
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
    const stripeCustomer = await stripe.customers.create({
      email: body.email,
      name: `${body.firstname} ${body.lastname}`

    })

    const newContactDetails = await Contact.create({
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phonenumber: body.phonenumber,
      mailaddress: body.mailaddress,
      billingaddress: body.billingaddress,
      stripeCustomerId: stripeCustomer.id
    });

    if (newContactDetails) {
      logger.info(
        `Contact LOG - Status: ${CREATE_STATUS_CODE} - Message: Contact created successfully`
      );
   
      console.log("stripe customerr", stripeCustomer)
      return res
        .status(CREATE_STATUS_CODE)
        .json({ message: "Contact created successfully", data: newContactDetails, stripeCustomer });



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
const DeleteContact = async (req, res) => {
  try {
    // exclude password, version, and createdAt timestamp
    const { id } = req.params

    const contact = await Contact.findByIdAndRemove(id);


    if (!contact) {
      logger.info(
        `DELETE Contacts LOG - Status: ${NOT_FOUND_STATUS_CODE} - Message: Delete Contact Does Not Exists`
      );
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .json({ message: "Contact Does Not Exists" });
    }
    return res
      .status(SUCCESS_STATUS_CODE)
      .json({ message: "Contact Deleted successfully" });


  } catch (error) {
    logger.error(
      `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
    );
    return res
      .status(error.status)
      .json({ message: error.message, errors: error?.errors });
  }
};
const UpdateContact = async (req, res) => {
  try {
    // exclude password, version, and createdAt timestamp
    const { id } = req.params

    const contact = await Contact.findByIdAndUpdate(id, req.body);


    if (!contact) {
      logger.info(
        `UPDATE Contacts LOG - Status: ${NOT_FOUND_STATUS_CODE} - Message:  Contact Does Not Exists`
      );
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .json({ message: "Contact Does Not Exists" });
    }
    return res
      .status(SUCCESS_STATUS_CODE)
      .json({ message: "Contact Updated successfully", data: contact });


  } catch (error) {
    logger.error(
      `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
    );
    return res
      .status(error.status)
      .json({ message: error.message, errors: error?.errors });
  }
};

module.exports = { AddContactController, GetContactsController, DeleteContact, UpdateContact };
