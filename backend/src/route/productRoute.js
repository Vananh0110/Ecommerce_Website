const { Router } = require('express');
const controller = require('../controller/productController');
const {uploadProduct} = require('../upload');

const router = Router();
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.post('/', uploadProduct.single('image'), controller.addProduct);
router.put('/:id', uploadProduct.single('image'),controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.get('/category/:category_id', controller.getProductsByCategoryId)

module.exports = router;
