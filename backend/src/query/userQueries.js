const loginQuery = `SELECT * FROM users WHERE email = ?`;

const registerQuery = `INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, 2)`;

const checkEmailExists = `SELECT email FROM users WHERE email = ?`;

const getAllUsers = `SELECT * FROM users WHERE role_id = 2`;

const getUserById = `SELECT * FROM users WHERE user_id = ?`;

const usersCount = `SELECT COUNT(*) AS total_users FROM users WHERE role_id = 2`;

const adminUpdateUser = `UPDATE users SET user_name = ?, email = ?, phone_number = ?, address = ?, status = ? WHERE user_id = ?`;

const updateUser = `
  UPDATE users
  SET user_name = ?, phone_number = ?, address = ?, avatar = ?
  WHERE user_id = ?
`;

const changePassword = `
  SELECT password FROM users
  WHERE user_id = ?
`;

const updatePassword = `
  UPDATE users
  SET password = ?
  WHERE user_id = ?
`;

const getAvatar = `SELECT avatar FROM users WHERE user_id = ?`;

const getUserWithOrderAmount = `
      SELECT 
          u.user_id,
          u.user_name,
          u.email,
          u.address,
          u.phone_number,
          u.avatar,
          COUNT(o.order_id) AS total_orders,
          SUM(CASE WHEN o.order_status = 'Paid' THEN o.total_money ELSE 0 END) AS total_paid_amount
      FROM 
          users u
      LEFT JOIN 
          orders o ON u.user_id = o.user_id
      WHERE 
          u.role_id = 2
      GROUP BY 
          u.user_id, u.user_name, u.email
`;

module.exports = {
  loginQuery,
  registerQuery,
  checkEmailExists,
  getAllUsers,
  getUserById,
  usersCount,
  adminUpdateUser,
  updateUser,
  changePassword,
  updatePassword,
  getAvatar,
  getUserWithOrderAmount
};
