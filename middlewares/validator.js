const { body } = require("express-validator");

const Validator = {

  userValidation: [

    body("email").notEmpty().withMessage("email cannot be empty."),

    body("password")
      .notEmpty()
      .withMessage("Password cannot be empty.")
  ],
  contactValidation: [
    body("firstname").notEmpty().withMessage("First Name cannot be empty."),

    body("lastname")
      .notEmpty()
      .withMessage("Last Name cannot be empty."),

    body("email")
      .isEmail()
      .notEmpty()
      .withMessage("email cannot be empty."),

    body("phonenumber")
      .notEmpty()
      .withMessage("phone number cannot be empty."),

   

  ]

};

module.exports = Validator;
