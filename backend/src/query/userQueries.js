const loginQuery = `SELECT * FROM users WHERE email = ?`;

const registerQuery = `INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, 2)`;

const checkEmailExists = `SELECT email FROM users WHERE email = ?`;

const getAllUsers = `SELECT * FROM users`;

const getUserById = `SELECT * FROM users WHERE user_id = ?`;

module.exports = {
  loginQuery,
  registerQuery,
  checkEmailExists,
  getAllUsers,
  getUserById,
};
