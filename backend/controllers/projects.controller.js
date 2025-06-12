const Project = require("../models/projects");
const Product = require("../models/products");
const mongoose = require("mongoose");

// Thêm dự án
exports.createProject = async (req, res, next) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    return res.status(200).json({ success: true, message: "Tạo dự án thành công", data: saved });
  } catch (err) {
    next(err);
  }
};

// Sửa dự án
exports.updateProject = async (req, res, next) => {
  try {
    console.log(req.body);
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, message: "Cập nhật dự án thành công", data: updated });
  } catch (err) {
    next(err);
  }
};

// Xóa dự án
exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Xóa dự án thành công" });
  } catch (err) {
    next(err);
  }
};

// Thêm sản phẩm vào dự án
exports.addProductToProject = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const project = await Project.findById(req.params.id);
    const product = await Product.findById(productId);

    if (!project || !product) {
      return res.status(404).json({ success: false, message: "Dự án hoặc sản phẩm không tồn tại" });
    }

    const productQuantity = quantity || 1;
    const existingProduct = project.list_product.find(item => item.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += productQuantity;
      existingProduct.total_product = existingProduct.quantity * product.price;
    } else {
      project.list_product.push({
        product: productId,
        quantity: productQuantity,
        total_product: productQuantity * product.price
      });
    }

    project.total = project.list_product.reduce((sum, item) => sum + item.total_product, 0);
    await project.save();

    return res.status(200).json({ success: true, message: "Thêm sản phẩm vào dự án thành công", data: project });
  } catch (err) {
    next(err);
  }
};

// Sửa sản phẩm trong dự án
exports.updateProductInProject = async (req, res, next) => {
  try {
    const { productId, quantity, total_product } = req.body;
    const project = await Project.findById(req.params.id);

    const product = project.list_product.id(req.params.productItemId);
    product.product = productId;
    product.quantity = quantity;
    product.total_product = total_product;

    await project.save();
    return res.status(200).json({ success: true, message: "Cập nhật sản phẩm trong dự án thành công", data: project });
  } catch (err) {
    next(err);
  }
};

// Xóa sản phẩm trong dự án
exports.deleteProductFromProject = async (req, res, next) => {
  try {
    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.productItemId)) {
      return res.status(400).json({ success: false, message: "ID không hợp lệ" });
    }

    // Tìm dự án
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Dự án không tồn tại" });
    }

    // Tìm sản phẩm trong list_product dựa trên product._id
    const productItemIndex = project.list_product.findIndex(
      (item) => item.product.toString() === req.params.productItemId
    );
    if (productItemIndex === -1) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại trong dự án" });
    }

    // Xóa sản phẩm
    project.list_product.splice(productItemIndex, 1);

    // Cập nhật tổng giá tiền
    project.total = project.list_product.reduce((sum, item) => sum + item.total_product, 0);

    // Lưu dự án
    await project.save();

    return res.status(200).json({ success: true, message: "Xóa sản phẩm khỏi dự án thành công", data: project });
  } catch (err) {
    next(err);
  }
};

// Lấy toàn bộ dự án
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("list_product.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách dự án thành công",
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// Lấy thông tin chi tiết dự án theo ID
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("list_product.product");

    if (!project) {
      return res.status(404).json({ success: false, message: "Dự án không tồn tại" });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin chi tiết dự án thành công",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};