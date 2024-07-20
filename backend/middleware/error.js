const ErrorHandler = require("../utils/errorHander");

module.exports = (err, req, res, next) => {
  err.status = err.statusCode || 500;
  err.message = err.message || "Internal Server Issue";

  // Send the error response
  res.status(err.status).json({
    success: "Nahi Mila",
    error: err.stack,
  });
};
