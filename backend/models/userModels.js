const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed more than 30 letters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter the Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter the password "],
    minLength: [4, "Password length cannot be less than 4 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Bcrypting the password in database before save event
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT
userSchema.methods.getJWTTocken = function () {
  // Generate JWT token with user's id and configured JWT_SECRET
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
userSchema.method.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
