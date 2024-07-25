const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");

const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");

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

  sendToken(user, 201, res);
});

//Login a User

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHander("Please enter email and password", 400)); //BAD Request 400
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401)); //UNAUTHORIZED
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401)); //UNAUTHORIZED
  }
  sendToken(user, 200, res);
});

//Logout User

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0), // Expires immediately
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // set to true in production
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
