const express = require("express");
const router = express.Router()

const validation = require("../middlewares/validator");
const { AddUserController, GetUserController, LoginUser } = require("../controllers/user");
const { AddContactController, GetContactsController, DeleteContact, UpdateContact } = require("../controllers/contact");
const { RetriveProduct, CreateSubscription } = require("../controllers/payments");

router.post("/user", validation.userValidation, AddUserController);
router.post("/login", validation.userValidation, LoginUser);
router.get("/user", GetUserController);
router.post("/contact", validation.contactValidation, AddContactController);
router.get("/contact", GetContactsController);
router.delete("/contact/:id", DeleteContact);
router.put("/contact/:id", UpdateContact);
router.get("/product", RetriveProduct);
router.post("/subscription", CreateSubscription);

module.exports = router;
