const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");

const User = require("../models/userModels");

//Register a User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample_id",
      url: "ok.co.in",
    },
  });
  const token = user.getJWTTocken();
  res.status(201).json({
    success: true,
    token,
  });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHander("Please enter email and password", 400)); //BAD Request 400
  }
});
