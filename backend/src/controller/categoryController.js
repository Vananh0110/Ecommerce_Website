const pool = require('../../db');
const queries = require('../query/categoryQueries');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(queries.getAllCategories);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [category] = await pool.query(queries.getCategoryById, [id]);
    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addCategory = async (req, res) => {
  const { category_name } = req.body;

  try {
    const [result] = await pool.query(queries.addCategory, [category_name]);
    res.status(201).json({
      message: 'Category added successfully',
      categoryId: result.insertId,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;
  try {
    const [result] = await pool.query(queries.updateCategory, [
      category_name,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
};
