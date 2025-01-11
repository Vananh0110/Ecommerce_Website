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

router.get('/newest', orderController.getNewestOrders);

router.post('/send-order-confirmation', async (req, res) => {
    const { email, orderDetails } = req.body;
    try {
      await sendOrderConfirmation(email, orderDetails);
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  });

module.exports = router;
