const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");

// Thêm sản phẩm
router.post("/create", productController.createProduct);

// Sửa sản phẩm
router.put("/:id", productController.updateProduct);

// Xóa sản phẩm
router.delete("/:id", productController.deleteProduct);


//Lấy toàn bộ sản phẩm
router.get("/", productController.getAllProducts);


//Lấy thông tin chi tiết sản phẩm
router.get("/:id", productController.getProductById);

module.exports = router;
