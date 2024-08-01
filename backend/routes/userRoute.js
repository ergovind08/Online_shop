const express = require("express");
const path = require("path");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  createReview,
  deleteReview,
  getReviews,
} = require("../controllers/userController");

const { isAuthenticate, authoriseRole } = require("../middleware/Auth");
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
router.put("/password/update", isAuthenticate, changePassword);

router.put("/me/update", isAuthenticate, updateUserProfile);
router.get("/admin/users", isAuthenticate, authoriseRole("admin"), getAllUsers);
router
  .get("/admin/user/:id", authoriseRole("admin"), getSingleUser)
  .put(isAuthenticate, authoriseRole("admin"), updateUserRole)
  .delete(isAuthenticate, authoriseRole("admin"), deleteUser);

router.put("/review", isAuthenticate, createReview);
router.get("/reviews", getReviews);
router.delete("/reviews", isAuthenticate, deleteReview);

module.exports = router;
