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

const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/comment', commentRoute);

app.use('/uploads', express.static('uploads'));

app.use('/', (req, res) => {
  res.send('Ecomerce Website');
});
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
