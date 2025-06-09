const Project = require("../models/projects");

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
    const { productId, quantity, total_product } = req.body;
    const project = await Project.findById(req.params.id);

    project.list_product.push({ product: productId, quantity, total_product });
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
    const project = await Project.findById(req.params.id);
    project.list_product.id(req.params.productItemId).remove();
    await project.save();
    return res.status(200).json({ success: true, message: "Xóa sản phẩm khỏi dự án thành công", data: project });
  } catch (err) {
    next(err);
  }
};


//Lấy toàn bộ dự án
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("list_product.product") // lấy thông tin chi tiết sản phẩm
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách dự án thành công",
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

