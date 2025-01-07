const { Router } = require('express');
const controller = require('../controller/commentController');
const {uploadComment} = require('../upload');

const router = Router();
router.post('/', uploadComment.single('image'), controller.addComment);
router.get('/by-product/:product_id', controller.getCommentsByProductId);
router.put('/:comment_id', uploadComment.single('image'), controller.updateComment);
router.delete('/:comment_id', controller.deleteComment);

module.exports = router;
