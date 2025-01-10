const getAllCategories = `SELECT c.category_id, c.category_name, COUNT(p.product_id) AS product_count
FROM categories c LEFT JOIN products p ON c.category_id = p.category_id GROUP BY c.category_id;
`;

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
