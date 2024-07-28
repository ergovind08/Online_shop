const express = require("express");
const path = require("path");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
} = require("../controllers/userController");
const { isAuthenticate } = require("../middleware/Auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/loginacc", loginUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/logout", logoutUser);
router.get("/password/reset/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "resetPassword.html"), (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});
router.get("/me", isAuthenticate, getUserDetails);

module.exports = router;
