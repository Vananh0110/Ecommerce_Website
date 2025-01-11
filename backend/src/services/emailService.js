const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmation = async (to, orderDetails) => {
  const { order_id, total_money, receiver_name, receiver_address, items } =
    orderDetails;

  const itemList = items
    .map(
      (item) =>
        `<li>${item.product_name} - ${
          item.quantity
        } x ${item.price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}</li>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Xác nhận đặt hàng #${order_id}`,
    html: `
        <h3>Chào ${receiver_name},</h3>
        <p>Cảm ơn bạn đã đặt hàng tại MotorOnline!</p>
        <p>Thông tin đơn hàng của bạn:</p>
        <ul>
          <li><strong>Mã đơn hàng:</strong> ${order_id}</li>
          <li><strong>Tổng tiền:</strong> ${total_money.toLocaleString(
            'vi-VN',
            {
              style: 'currency',
              currency: 'VND',
            }
          )}</li>
          <li><strong>Địa chỉ nhận hàng:</strong> ${receiver_address}</li>
          <li><strong>Sản phẩm:</strong></li>
          <ul>${itemList}</ul>
        </ul>
        <p>Chúng tôi sẽ sớm giao hàng đến bạn. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ MotorOnline</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent.');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

module.exports = { sendOrderConfirmation };
