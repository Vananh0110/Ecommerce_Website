const { Router } = require('express');
const orderController = require('../controller/orderController');

const router = Router();

router.post('/', orderController.createOrder);

router.get('/:order_id', orderController.getOrderDetailById);

router.get('/user/:user_id', orderController.getUserOrders);

router.put('/:order_id', orderController.updateOrderStatus);

router.put('/item/:order_item_id', orderController.updateOrderItemQuantity);

router.delete('/:order_id', orderController.deleteOrder);

router.get('/', orderController.getAllOrders);


module.exports = router;
