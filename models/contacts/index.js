const mongoose = require("mongoose");

const ContactDetailsSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  mailaddress: {
    type: String,
  },
  billingaddress: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
  },
});

// ContactDetailsSchema.pre("save", function (next) {
//   if (!this.createdAt) {
//     this.createdAt = new Date();
//   }
//   next();
// });

const Contact = mongoose.model("contacts", ContactDetailsSchema);

module.exports = Contact;
