const { Router } = require('express');
const controller = require('../controller/orderController');

const router = Router();

router.post('/', controller.createOrder);
router.get('/:order_id', controller.getOrder);
router.get('/', controller.getAllOrders);
router.put('/:order_id', controller.updateOrder);
router.delete('/:order_id', controller.deleteOrder);
router.get('/user/:user_id', controller.getOrdersByUserId);
router.get('/product/:product_id', controller.getOrdersByProductId);

module.exports = router;
