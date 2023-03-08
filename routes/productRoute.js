const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
isAdmin
const router = express.Router();

router.post("/", isAdmin, authMiddleware, createProduct);
router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.put("/:id", isAdmin, authMiddleware, updateProduct);
router.delete("/:id", isAdmin, authMiddleware, deleteProduct);

module.exports = router;
