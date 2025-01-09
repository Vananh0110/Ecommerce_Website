const getAllCartByUserId = `SELECT * FROM cart JOIN products ON cart.product_id = products.product_id WHERE user_id = ?`;

const addProductToCart = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?)`;

const updateQuantityProduct = `UPDATE cart SET quantity = ? WHERE cart_id = ?`;

const deleteCart = `DELETE FROM cart WHERE cart_id = ?`;

const deleteCartOfUserId = `DELETE FROM cart WHERE user_id = ?`

module.exports = {
  getAllCartByUserId,
  addProductToCart,
  updateQuantityProduct,
  deleteCart,
  deleteCartOfUserId
};
