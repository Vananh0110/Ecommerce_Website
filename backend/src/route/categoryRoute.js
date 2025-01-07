const { Router } = require('express');
const controller = require('../controller/categoryController');

const router = Router();

router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategoryById);
router.post('/', controller.addCategory);
router.put('/', controller.addCategory);

module.exports = router;
