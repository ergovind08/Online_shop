const Product = require("../models/productModels");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// Create Product
const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.createdByUser = req.user.id;
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product: newProduct,
  });
});

// Get all products
const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 10;
  const ProductCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // const products = await Product.find();
  const products = await apiFeature.query;
  // const names = products.map((product) => product.name);
  res.status(200).json({
    success: true,
    products,
    ProductCount,
  });
});

// Update Product by ID
const updateProduct = catchAsyncError(async (req, res, next) => {
  const productId = req.params.id;
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

// Delete the Product
const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Get product Details By ID
const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product nahi hai ree", 404));
  }

  res.status(200).json({
    success: "mil gaya",
    message: "Product Details",
    product,
  });
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
};
