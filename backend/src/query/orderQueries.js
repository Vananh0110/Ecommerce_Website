const createOrder = `INSERT INTO orders (product_id, user_id, quantity, total_money, payment_type, order_status, user_note, receiver_name, receiver_phone, receiver_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const getOrderById = `SELECT * FROM orders WHERE order_id = ?`;

const getAllOrders = `SELECT * FROM orders`;

const updateOrder = `UPDATE orders SET quantity = ?, total_money = ?, payment_type = ?, order_status = ?, user_note = ?, receiver_name = ?, receiver_phone = ?, receiver_address = ? WHERE order_id = ?`;

const deleteOrder = `DELETE FROM orders WHERE order_id = ?`;

const getOrdersByUserId = `SELECT * FROM orders WHERE user_id = ?`;

const getOrdersByProductId = `SELECT * FROM orders WHERE product_id = ?`;

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getOrdersByProductId
};
