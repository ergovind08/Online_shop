const ErrorHandler = require("../utils/errorHander");

module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Issue";

  // Handling MongoDB ObjectId cast error (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found. Invalid path: ${err.path} and Id: ${err.value}`;
    status = 404;
  }

  // Handling MongoDB document not found error (NotFoundError)
  if (err.name === "NotFoundError") {
    message = "Resource not found. Document not found in database.";
    status = 404;
  }

  // Creating a new ErrorHandler instance if status is 500
  if (status === 500) {
    err = new ErrorHandler(message, status);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyvalue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //Json web token error
  if ((err.name = "jsonWebTokenError")) {
    const message = "Json web Token is invalid ,Try Again";
    err = new ErrorHandler(message, 400);
  }
  //Json Web token expire error
  if ((err.name = "TokenExpiredError")) {
    const message = "Json web Token is EXpired ,Try Again";
    err = new ErrorHandler(message, 400);
  }

  // Send the error response
  res.status(status).json({
    success: false,
    error: message,
  });
};
