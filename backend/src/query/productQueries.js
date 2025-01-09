const getAllProducts = `SELECT * FROM products`;

const getProductById = `SELECT * FROM products WHERE product_id = ?`;

const addProduct = `INSERT INTO products (name, description, image, price, status, stock, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

const updateProduct = `UPDATE products SET name = ?, description = ?, image = ?, price = ?, status = ?, stock = ?, category_id = ? WHERE product_id = ?`;

const deleteProduct = `DELETE FROM products WHERE product_id = ?`;

const getImage = `SELECT image FROM products WHERE product_id = ?`;

const getProductsByCategoryId = `SELECT * FROM products WHERE category_id = ?`;

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getImage,
  getProductsByCategoryId
};
