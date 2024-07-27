const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//routes import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

//middleware for getting result from backend
app.use("/api/v1", user);
app.use("/api/v1", product);

//middleware for error
app.use(errorMiddleware);

module.exports = app;
