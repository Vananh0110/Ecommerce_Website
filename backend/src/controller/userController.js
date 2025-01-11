const bcrypt = require('bcrypt');
const pool = require('../../db');
const queries = require('../query/userQueries');
const fs = require('fs');
const path = require('path');

const registerUser = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    const [users] = await pool.query(queries.checkEmailExists, [email]);
    if (users.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(queries.registerQuery, [
      user_name,
      email,
      hashedPassword,
    ]);
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results, fields] = await pool.execute(queries.loginQuery, [email]);
    const user = results[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    delete user.password;
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(queries.getAllUsers);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await pool.query(queries.getUserById, [id]);
    if (user.length > 0) {
      res.status(200).json(user[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUsersCount = async (req, res) => {
  try {
    const [result] = await pool.query(queries.usersCount);
    res.json({ count: result[0].total_users });
  } catch (error) {
    console.error('Failed to fetch user account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const adminUpdateUser = async (req, res) => {
  const { user_id } = req.params;
  const { user_name, email, phone_number, address, status } = req.body;

  try {
    const [result] = await pool.query(queries.adminUpdateUser, [
      user_name,
      email,
      phone_number,
      address,
      status,
      user_id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  const { user_id } = req.params;
  const { current_password, new_password } = req.body;

  try {
    const [user] = await pool.query(queries.changePassword, [user_id]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, user[0].password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(queries.updatePassword, [hashedPassword, user_id]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { user_name, phone_number, address } = req.body;

  try {
    const [oldImage] = await pool.query(queries.getAvatar, [user_id]);
    const oldImagePath = oldImage.length > 0 ? oldImage[0].avatar : null;

    const newImagePath = req.file?.filename
      ? `uploads/avatars/${req.file.filename}`
      : oldImagePath;

    const [result] = await pool.query(queries.updateUser, [
      user_name,
      phone_number,
      address,
      newImagePath,
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file && oldImagePath && newImagePath !== oldImagePath) {
      const oldImageFullPath = path.join(__dirname, '../..', oldImagePath);
      if (fs.existsSync(oldImageFullPath)) {
        fs.unlink(oldImageFullPath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          }
        });
      }
    }

    res.json({
      message: 'User updated successfully',
      avatar: newImagePath,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getUserWithOrderAmount = async (req, res) => {
  try {
    const [users] = await pool.query(queries.getUserWithOrderAmount);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [[customers]] = await pool.query(
      'SELECT COUNT(*) AS total_customers FROM users WHERE role_id = 2'
    );
    const [[categories]] = await pool.query(
      'SELECT COUNT(*) AS total_categories FROM categories'
    );
    const [[orders]] = await pool.query(
      'SELECT COUNT(*) AS total_orders FROM orders'
    );
    const [[paid]] = await pool.query(
      'SELECT SUM(total_money) AS total_paid FROM orders WHERE order_status = "Paid"'
    );

    res.json({
      total_customers: customers.total_customers,
      total_categories: categories.total_categories,
      total_orders: orders.total_orders,
      total_paid: paid.total_paid || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getNewestUsers = async (req, res) => {
  try {
    const query = `
      SELECT user_id, user_name, email
      FROM users 
      WHERE role_id = 2 
      ORDER BY user_id DESC 
      LIMIT 3
    `;
    const [users] = await pool.query(query);
    res.json(users);
  } catch (error) {
    console.error('Error fetching newest users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  changePassword,
  updateUser,
  getUserWithOrderAmount,
  getDashboardStats,
  getNewestUsers
};
