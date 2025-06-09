const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projects.controller");

// Thêm dự án
router.post("/create", projectController.createProject);

// Sửa dự án
router.put("/:id", projectController.updateProject);

// Xóa dự án
router.delete("/:id", projectController.deleteProject);

// Thêm sản phẩm vào dự án
router.post("/:id/add-product", projectController.addProductToProject);

// Sửa sản phẩm trong dự án
router.put("/:id/update-product/:productItemId", projectController.updateProductInProject);

// Xóa sản phẩm khỏi dự án
router.delete("/:id/delete-product/:productItemId", projectController.deleteProductFromProject);


//Lấy toàn bộ dự án
router.get("/", projectController.getAllProjects);


module.exports = router;
