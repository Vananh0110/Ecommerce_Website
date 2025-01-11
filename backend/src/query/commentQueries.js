const addComment = `INSERT INTO comments (product_id, user_id, content, image) VALUES (?, ?, ?, ?)`;

const getCommentsByProductId = `SELECT * FROM comments JOIN users ON comments.user_id = users.user_id
WHERE product_id = ?`;

const getCommentById = `SELECT * FROM comments WHERE comment_id = ?`;

const updateComment = `UPDATE comments SET content = ?, image = ? WHERE comment_id = ?`;

const deleteComment = `DELETE FROM comments WHERE comment_id = ?`;

const getImage = `SELECT image FROM comments WHERE comment_id = ?`;

const getAllComments = `
  SELECT 
      c.comment_id, 
      c.product_id, 
      c.user_id, 
      c.content, 
      c.image, 
      c.created_at, 
      p.name AS product_name, 
      u.user_name
  FROM 
      comments c
  JOIN 
      products p ON c.product_id = p.product_id
  JOIN 
      users u ON c.user_id = u.user_id
  ORDER BY 
      c.created_at DESC;
`;

module.exports = {
  addComment,
  getCommentsByProductId,
  getCommentById,
  updateComment,
  deleteComment,
  getImage,
  getAllComments 
};
