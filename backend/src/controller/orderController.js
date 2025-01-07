const pool = require('../../db');
const queries = require('../query/orderQueries');

const createOrder = async (req, res) => {
  const {
    product_id,
    user_id,
    quantity,
    total_money,
    payment_type,
    order_status,
    user_note,
  } = req.body;

  try {
    await pool.query(queries.createOrder, [
      product_id,
      user_id,
      quantity,
      total_money,
      payment_type,
      order_status,
      user_note,
    ]);
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [order] = await pool.query(queries.getOrderById, [order_id]);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(queries.getAllOrders);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateOrder = async (req, res) => {
  const {
    order_id,
    quantity,
    total_money,
    payment_type,
    order_status,
    user_note,
  } = req.body;

  try {
    const [result] = await pool.query(queries.updateOrder, [
      quantity,
      total_money,
      payment_type,
      order_status,
      user_note,
      order_id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [result] = await pool.query(queries.deleteOrder, [order_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrdersByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [orders] = await pool.query(queries.getOrdersByUserId, [user_id]);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOrdersByProductId = async (req, res) => {
    const { product_id } = req.params;

    try {
        const [orders] = await pool.query(queries.getOrdersByProductId, [product_id]);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getOrdersByProductId
};
