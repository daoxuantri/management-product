const Product = require("../models/products");

// Thêm sản phẩm
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name, code, specificProduct, origin, brand, yrs_manu,
      price, unit, priceDate, supplier,asker, note, 
    } = req.body;

    const newProduct = new Product({
      name,
      code,
      specificProduct,
      origin,
      brand,
      yrs_manu,
      price,
      unit,
      priceDate,
      supplier,
      asker,
      note,
    });

    const saved = await newProduct.save();

    return res.status(200).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: saved
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thêm sản phẩm",
      error: err.message
    });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: err.message
    });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error: err.message
    });
  }
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: err.message
    });
  }
};



exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin sản phẩm thành công",
      data: product
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm",
      error: err.message
    });
  }
};
