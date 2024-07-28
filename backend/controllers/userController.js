const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");

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

//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n If you did not request this email, please ignore it.`;

  try {
    const emailResponse = await sendEmail({
      email: user.email,
      subject: "Online-Order Website Password Recovery",
      message: message,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">Hello,${user.name}</p>
        <p style="color: #555;">You have requested a password reset for your account. Please click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <p style="color: #555; margin-top: 20px;">If you did not request this email, please ignore it.</p>
        <p style="color: #555;">Thank you,<br>Online-Order Team</p>
      </div>
      
    `,
    });

    if (emailResponse.success) {
      console.log(`Email sent to ${user.email} successfully`);
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } else {
      console.error(
        `Failed to send email to ${user.email}:`,
        emailResponse.error
      );
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHander(emailResponse.error, 500));
    }
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHander("Reset password token is invalid", 400));
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHander("Both password not matched", 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Get User Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ sucees: true, user });
});
