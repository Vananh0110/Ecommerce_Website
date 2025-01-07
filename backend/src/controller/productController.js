const pool = require('../../db');
const queries = require('../query/productQueries');
const fs = require('fs');
const path = require('path');

const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(queries.getAllProducts);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await pool.query(queries.getProductById, [id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, status, stock, category_id } = req.body;
  const image = req.file ? `uploads/products/${req.file.filename}` : '';
  try {
    const [result] = await pool.query(queries.addProduct, [
      name,
      description,
      image,
      price,
      status,
      stock,
      category_id,
    ]);
    res.status(201).json({
      message: 'Product added successfully',
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, status, stock, category_id } = req.body;
  let newImagePath;

  try {
    const [oldImage] = await pool.query(queries.getImage, [id]);
    const oldImagePath = oldImage[0] ? oldImage[0].image : null;
    if (req.file) {
      newImagePath = `uploads/products/${req.file.filename}`;
      const [result] = await pool.query(queries.updateProduct, [
        name,
        description,
        newImagePath,
        price,
        status,
        stock,
        category_id,
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (oldImagePath && newImagePath !== oldImagePath) {
        fs.unlink(path.join(__dirname, '..', oldImagePath), (err) => {
          if (err) console.log(`Failed to delete old image: ${err}`);
        });
      }

      res.json({
        message: 'Product updated successfully',
        updatedImage: newImagePath,
      });
    } else {
      const [result] = await pool.query(queries.updateProduct, [
        name,
        description,
        oldImagePath,
        price,
        status,
        stock,
        category_id,
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({
        message: 'Product updated successfully',
        updatedImage: oldImagePath,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [image] = await pool.query(
      'SELECT image FROM product WHERE product_id = ?',
      [id]
    );
    if (image.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const imagePath = image[0].image;
    const [result] = await pool.query(queries.deleteProduct, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (imagePath) {
      fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
        if (err) {
          console.log(`Failed to delete image: ${err}`);
          return res
            .status(500)
            .json({ message: 'Failed to delete associated image' });
        }
      });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
