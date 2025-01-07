const pool = require('../../db');
const queries = require('../query/commentQueries');
const fs = require('fs');
const path = require('path');

const addComment = async (req, res) => {
  const { product_id, user_id, content } = req.body;
  const image = req.file ? `uploads/comments/${req.file.filename}` : null;

  try {
    await pool.query(queries.addComment, [product_id, user_id, content, image]);
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCommentsByProductId = async (req, res) => {
  const { product_id } = req.params;

  try {
    const [comments] = await pool.query(queries.getCommentsByProductId, [
      product_id,
    ]);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { content } = req.body;
  const newImage = req.file ? `uploads/comments/${req.file.filename}` : null;

  try {
    const [oldImageData] = await pool.query(queries.getImage, [comment_id]);
    const oldImage = oldImageData[0].image;
    const [updateResult] = await pool.query(queries.updateComment, [
      content,
      newImage || oldImage,
      comment_id,
    ]);
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (newImage && oldImage) {
      fs.unlink(path.join(__dirname, '..', oldImage), (err) => {
        if (err) {
          console.error(`Failed to delete old image: ${err}`);
        }
      });
    }

    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const [imageData] = await pool.query(queries.getImage, [comment_id]);
    const image = imageData[0].image;
    const [result] = await pool.query(queries.deleteComment, [comment_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (image) {
      fs.unlink(path.join(__dirname, '..', image), (err) => {
        if (err) {
          console.error(`Failed to delete image: ${err}`);
        }
      });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addComment,
  getCommentsByProductId,
  updateComment,
  deleteComment,
};
