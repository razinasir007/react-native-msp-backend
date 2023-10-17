const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserDetailsSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

const User = mongoose.model("user", UserDetailsSchema);

module.exports = User;
