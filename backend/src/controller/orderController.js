const pool = require('../../db');
const queries = require('../query/orderQueries');

// Tạo đơn hàng
const createOrder = async (req, res) => {
  const {
    user_id,
    total_money,
    payment_type,
    receiver_name,
    receiver_phone,
    receiver_address,
    user_note,
    items,
  } = req.body;

  try {
    const [orderResult] = await pool.query(
      queries.createOrder,
      [
        user_id,
        total_money,
        payment_type,
        'Pending',
        receiver_name,
        receiver_phone,
        receiver_address,
        user_note,
      ]
    );

    const orderId = orderResult.insertId;

    const orderItems = items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    await pool.query(queries.addOrderItems, [orderItems]);

    res.status(201).json({ message: 'Order created successfully', order_id: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getOrderDetailById = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [orderDetails] = await pool.query(queries.getOrderDetailById,
      [order_id]
    );

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = {
      ...orderDetails[0],
      items: orderDetails.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [orders] = await pool.query(queries.getOrdersByUserId, [user_id]);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  try {
    const [result] = await pool.query(queries.updateOrderStatus, [order_status, order_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOrderItemQuantity = async (req, res) => {
  const { order_item_id } = req.params;
  const { quantity } = req.body;

  try {
    const [result] = await pool.query(queries.updateOrderItemQuantity, [quantity, order_item_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    res.json({ message: 'Order item quantity updated successfully' });
  } catch (error) {
    console.error('Error updating order item quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
}
module.exports = {
  createOrder,
  getOrderDetailById,
  getUserOrders,
  updateOrderStatus,
  updateOrderItemQuantity,
  deleteOrder,
  getAllOrders
};
