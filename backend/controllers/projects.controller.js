const Project = require("../models/projects");
const Product = require("../models/products");

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

    // Nếu không truyền quantity, mặc định là 1
    const productQuantity = quantity || 1;

    // Kiểm tra xem sản phẩm đã có trong list_product chưa
    const existingProduct = project.list_product.find(item => item.product.toString() === productId);

    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, cập nhật quantity và total_product
      existingProduct.quantity += productQuantity;
      existingProduct.total_product = existingProduct.quantity * product.price;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      project.list_product.push({
        product: productId,
        quantity: productQuantity,
        total_product: productQuantity * product.price
      });
    }

    // Cập nhật tổng giá trị dự án
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
    const project = await Project.findById(req.params.id);
    project.list_product.id(req.params.productItemId).remove();
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