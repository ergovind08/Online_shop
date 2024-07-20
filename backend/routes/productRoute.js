const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");

// Route to get all products
router.get("/products", getAllProducts);

// Route to create a new product
router.post("/products/new", createProduct);

// Route to update  the product
router.put("/products/:id", updateProduct);

//Route to Delete the Product
router.delete("/products/:id", deleteProduct);

//Route for Get Details
router.get("/products/:id", getProductDetails);

module.exports = router;
