const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Create new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const productExist = req.body.title;
    const findProduct = await Product.exists({ title: productExist });
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    if (!findProduct) {
      const newProduct = new Product(req.body);
      try {
        const savedProduct = await newProduct.save();
        res.send({ success: true, data: savedProduct });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.send({
        success: false,
        message: "Sản phẩm đã tồn tại vui lòng tạo lại.",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, }
    );
    res.send({
      success: true,
      data: updatedProduct,
      message: "Đã cập nhật sản phẩm thành công."
    })
  } catch (error) {
    throw new Error(error);
  }
});
// Get a product
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.send({
      success: true,
      data: findProduct,
    });
  } catch (error) {
    response.send({
      success: false,
      message: "Sản phẩm không được tìm thấy hoặc không tồn tại",
    });
  }
});
// Get all product
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const getAllProduct = await Product.find();
    res.send({
      success: true,
      data: getAllProduct,
      total: getAllProduct.length,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.send({
      success: true,
      message: "Đã xóa sản phẩm thành công."
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
