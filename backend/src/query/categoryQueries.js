const getAllCategories = `SELECT * FROM categories`;

const getCategoryById = `SELECT * FROM categories WHERE category_id = ?`;

const addCategory = `INSERT INTO categories (category_name) VALUES (?)`;

const updateCategory = `UPDATE categories SET category_name = ? WHERE category_id = ?`;

const deleteCategory = `DELETE FROM categories WHERE category_id = ?`;

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
