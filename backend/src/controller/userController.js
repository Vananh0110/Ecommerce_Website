const bcrypt = require('bcrypt');
const pool = require('../../db');
const queries = require('../query/userQueries');

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

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
  getUserById,
  adminUpdateUser
};
