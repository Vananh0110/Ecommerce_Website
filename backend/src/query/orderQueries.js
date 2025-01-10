const orderQueries = {
  createOrder: `
    INSERT INTO orders (
      user_id, total_money, payment_type, order_status, receiver_name, receiver_phone, receiver_address, user_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  addOrderItems: `
    INSERT INTO order_items (
      order_id, product_id, quantity, price
    ) VALUES ?
  `,

  getOrderDetailById: `
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
  `,

  getOrdersByUserId: `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `,

  updateOrderStatus: `
    UPDATE orders SET order_status = ? WHERE order_id = ?
  `,

  updateOrderItemQuantity: `
    UPDATE order_items SET quantity = ? WHERE order_item_id = ?
  `,

  deleteOrder: `
    DELETE FROM orders WHERE order_id = ?
  `,

  deleteOrderItems: `
    DELETE FROM order_items WHERE order_id = ?
  `,
  getAllOrders: `
  SELECT * FROM orders;`,
};

module.exports = orderQueries;
