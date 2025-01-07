const addComment = `INSERT INTO comments (product_id, user_id, content, image) VALUES (?, ?, ?, ?)`;

const getCommentsByProductId = `SELECT * FROM comments WHERE product_id = ?`;

const getCommentById = `SELECT * FROM comments WHERE comment_id = ?`;

const updateComment = `UPDATE comments SET content = ?, image = ? WHERE comment_id = ?`;

const deleteComment = `DELETE FROM comments WHERE comment_id = ?`;

const getImage = `SELECT image FROM comments WHERE comment_id = ?`;

module.exports = {
  addComment,
  getCommentsByProductId,
  getCommentById,
  updateComment,
  deleteComment,
  getImage,
};
