const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/loginacc", loginUser);
router.post("/password/forgot", forgotPassword);
router.get("/logout", logoutUser);

module.exports = router;
