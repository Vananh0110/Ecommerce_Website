const loginQuery = `SELECT * FROM user WHERE email = ?`;

const registerQuery = `INSERT INTO user (user_name, email, password, role_id) VALUES (?, ?, ?, 2)`;

const checkEmailExists = `SELECT email FROM user WHERE email = ?`;

const getAllUsers = `SELECT * FROM user`;

const getUserById = `SELECT * FROM user WHERE user_id = ?`;

module.exports = {
  loginQuery,
  registerQuery,
  checkEmailExists,
  getAllUsers,
  getUserById,
};
