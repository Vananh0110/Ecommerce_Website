const { Router } = require('express');
const controller = require('../controller/cartController');

const router = Router();

router.post('/', controller.addProductToCart);
router.get('/:user_id', controller.getAllCartByUserId);
router.put('/:cart_id', controller.updateQuantityProduct);
router.delete('/:cart_id', controller.deleteCart);
router.delete('/delete-all/:user_id', controller.deleteCartOfUserId);
router.post('/delete-selected', controller.deleteSelectedCartItems);

module.exports = router;
