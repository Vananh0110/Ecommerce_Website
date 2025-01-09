const loginQuery = `SELECT * FROM users WHERE email = ?`;

const registerQuery = `INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, 2)`;

const checkEmailExists = `SELECT email FROM users WHERE email = ?`;

const getAllUsers = `SELECT * FROM users WHERE role_id = 2`;

const getUserById = `SELECT * FROM users WHERE user_id = ?`;

const usersCount = `SELECT COUNT(*) AS total_users FROM users WHERE role_id = 2`;

const adminUpdateUser = `UPDATE users SET user_name = ?, email = ?, phone_number = ?, address = ?, status = ? WHERE user_id = ?`;

module.exports = {
  loginQuery,
  registerQuery,
  checkEmailExists,
  getAllUsers,
  getUserById,
  usersCount,
  adminUpdateUser
};
