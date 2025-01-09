const pool = require('../../db');
const queries = require('../query/cartQueries');

const getAllCartByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [products] = await pool.query(queries.getAllCartByUserId, [user_id]);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Serve Error' });
  }
};

const addProductToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    await pool.query(queries.addProductToCart, [user_id, product_id, quantity]);
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Serve Error' });
  }
};

const updateQuantityProduct = async (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;
  try {
    const [result] = await pool.query(queries.updateQuantityProduct, [
      quantity,
      cart_id,
    ]);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Cart updated successfull' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Serve Error' });
  }
};
const deleteCart = async (req, res) => {
  const { cart_id } = req.params;
  try {
    const [result] = await pool.query(queries.deleteCart, [cart_id]);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Serve Error' });
  }
};

const deleteCartOfUserId = async (req, res) => {
  const { user_id } = req.params.user_id;

  try {
    const [result] = await pool.query(queries.deleteCartOfUserId, [user_id]);
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Serve Error' });
  }
};
module.exports = {
  getAllCartByUserId,
  addProductToCart,
  updateQuantityProduct,
  deleteCart,
  deleteCartOfUserId
};
