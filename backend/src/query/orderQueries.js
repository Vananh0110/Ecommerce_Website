const createOrder = `
    INSERT INTO orders (
      user_id, total_money, payment_type, order_status, receiver_name, receiver_phone, receiver_address, user_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

const  addOrderItems =`
    INSERT INTO order_items (
      order_id, product_id, quantity, price
    ) VALUES ?
  `;

const  getOrderDetailById = `
    SELECT
    o.order_id,
    o.total_money,
    o.payment_type,
    o.order_status,
    o.receiver_name,
    o.receiver_phone,
    o.receiver_address,
    o.user_note,
    o.created_at,
    oi.quantity,
    oi.price,
    p.product_id,
    p.name as product_name,
    p.image
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_id = ?;
  `;


const  getOrdersByUserId = `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;

const updateOrderStatus = `
    UPDATE orders SET order_status = ? WHERE order_id = ?
  `;

const  updateOrderItemQuantity = `
    UPDATE order_items SET quantity = ? WHERE order_item_id = ?
  `;

const deleteOrder = `
    DELETE FROM orders WHERE order_id = ?
  `;

const deleteOrderItems = `
    DELETE FROM order_items WHERE order_id = ?
  `;

const getAllOrders = `
  SELECT * FROM orders`;

const getNewestOrders = `
  SELECT order_id, receiver_name, total_money, created_at, order_status 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 3
  `;

module.exports = {
  createOrder,
  addOrderItems,
  getOrderDetailById,
  getOrdersByUserId,
  updateOrderStatus,
  updateOrderItemQuantity,
  deleteOrder,
  deleteOrderItems,
  getAllOrders,
  getNewestOrders
}
