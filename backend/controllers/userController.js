const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const { authoriseRole } = require("../middleware/Auth.js");
const Product = require("../models/productModels.js");
const { query } = require("express");

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
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
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

//Reset Password form email
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

//Change password
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Old Password is incorrect", 400));
  }
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHander("Both password not matched", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  res
    .status(200)
    .json({ sucees: true, message: "Password changed successfully" });

  sendToken(user, 200, res);
});

//Update user Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //we will use cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await user.save();
  res
    .status(200)
    .json({ sucees: true, message: "User profile updated successfully" });
});

//Get all User ->> that can be seen by admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: `Access denied. Admins only. here role is ${req.user.role}`,
    });
  }

  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
//Get single user by admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role by ---(Admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //we will use cloudinary later
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await user.save();
  res
    .status(200)
    .json({ sucees: true, message: "User profile updated successfully" });
});

//delete user by there id by ----- admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // we will remove the cloudinary data later

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

//create new review and update new review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("Product not found"));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user && rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user && rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
    avg /= product.reviews.length;
  });
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed ? "Review updated" : "Review added",
  });
});

//Get All Reviews of a Single Product
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHander("Product Not Found with this Id ", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHander("Product Not Found with this Id ", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() != req,
    query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => (avg += rev.rating));
  const rating = avg / reviews.length;
  const numberOfReviews = reviews.length;
  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
});
