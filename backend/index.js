const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const PORT = 5000;
require('dotenv').config();

const userRoute = require('./src/route/userRoute');
const categoryRoute = require('./src/route/categoryRoute');
const productRoute = require('./src/route/productRoute');
const commentRoute = require('./src/route/commentRoute');
const cartRoute = require('./src/route/cartRoute');
const orderRoute = require('./src/route/orderRoute');

const multer = require('multer');
const path = require('path');
const { default: axios } = require('axios');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/comment', commentRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);

app.use('/uploads', express.static('uploads'));

app.post('/payment-momo', async (req, res) => {
  const { order_id, amount } = req.body;

  var accessKey = 'F8BBA842ECF85';
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var orderInfo = 'pay with MoMo';
  var partnerCode = 'MOMO';
  var redirectUrl = 'http://localhost:3000/payment-success';
  var ipnUrl =
    'https://c2fd-2001-ee0-49cd-80a0-65e7-d020-3cf0-285d.ngrok-free.app/callback';
  var requestType = 'payWithMethod';
  var orderId = String(order_id) + partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = '';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;
  //puts raw signature
  console.log('--------------------RAW SIGNATURE----------------');
  console.log(rawSignature);
  //signature
  const crypto = require('crypto');
  var signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
  console.log('--------------------SIGNATURE----------------');
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});
const extractOriginalOrderId = (orderId) => {
  const index = orderId.indexOf("MOMO"); 
  if (index === -1) return null; 
  const originalOrderId = orderId.substring(0, index); 
  return parseInt(originalOrderId, 10);
};
app.post('/callback', async (req, res) => {
  try {
    const { orderId, resultCode, message } = req.body;

    const originalOrderId =  extractOriginalOrderId(orderId);

    console.log('Callback received:', req.body);
    if (resultCode === 0) {
      console.log(`Order ${orderId} thanh toán thành công.`);

      await axios.put(`http://localhost:5000/order/${originalOrderId}`, {
        order_status: 'Đang xử lý',
      });

      res.status(204).send();
    } else {
      console.log(`Order ${orderId} thanh toán thất bại: ${message}`);
      res.status(200).json({ message: 'Payment failed or canceled.' });
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/check-status-transaction', async (req, res) => {
  const { orderId } = req.body;

  // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
  // &requestId=$requestId
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var accessKey = 'F8BBA842ECF85';
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  const result = await axios(options);

  return res.status(200).json(result.data);
});

app.use('/', (req, res) => {
  res.send('Ecomerce Website');
});
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
