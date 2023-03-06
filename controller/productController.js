const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  try {
    const productExist = req.body.title;
    const findProduct = await Product.findOne({ productExist });
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
        message: "Sản phẩm đã tồn tại vui lòng tạo lại."
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct };
