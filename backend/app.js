const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorMiddleware = require("./middleware/error");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware for routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);

// Middleware for error
app.use(errorMiddleware);

module.exports = app;
