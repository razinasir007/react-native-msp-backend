const express = require("express");
const router = express.Router()

const validation = require("../middlewares/validator");
const { AddUserController, GetUserController, LoginUser } = require("../controllers/user");
const { AddContactController, GetContactsController } = require("../controllers/contact");

router.post("/user", validation.userValidation, AddUserController);
router.post("/login", validation.userValidation, LoginUser);
router.get("/user", GetUserController);
router.post("/contact", validation.contactValidation, AddContactController);
router.get("/contact", GetContactsController);

module.exports = router;
