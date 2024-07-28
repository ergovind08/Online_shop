const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticate } = require("../middleware/Auth");
const { authoriseRole } = require("../middleware/Auth"); // Assuming authoriseRole is correctly implemented in Auth.js

// Route to get all products
router.get("/products", isAuthenticate, getAllProducts);

// Route to create a new product
router.post(
  "/admin/products/new",
  isAuthenticate,
  authoriseRole("admin"),
  createProduct
);

// Route to update the product
router.put(
  "/admin/products/:id",
  isAuthenticate,
  authoriseRole("admin"),
  updateProduct
);

// Route to delete the product
router.delete(
  "/admin/products/:id",
  isAuthenticate,
  authoriseRole("admin"),
  deleteProduct
);

// Route to get product details
router.get("/products/:id", isAuthenticate, getProductDetails);

module.exports = router;
