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

// Route to get all products
router.get("/products", isAuthenticate, getAllProducts);

// Route to create a new product
router.post("/products/new", createProduct);

// Route to update  the product
router.put("/products/:id", updateProduct);

//Route to Delete the Product
router.delete("/products/:id", deleteProduct);

//Route for Get Details
router.get("/products/:id", isAuthenticate, getProductDetails);

module.exports = router;
