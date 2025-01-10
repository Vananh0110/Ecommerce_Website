import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../../layouts/user/Layout';
import { Button, message, Spin } from 'antd';
import axios from '../../api/axios';

const PaymentPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const orderData = location.state || {};

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/payment-momo', {
        order_id: orderData.order_id,
        amount: orderData.total,
      });
      console.log(response.data);
      if (response.data.resultCode === 0) {
        message.success('Chuyển hướng đến trang thanh toán MoMo...');
        window.location.href = response.data.payUrl;
      } else {
        message.error(response.data.message || 'Thanh toán thất bại.');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      message.error('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Thanh toán online</h1>
        <div className="mb-6">
          <p>
            <strong>Người nhận:</strong> {orderData.receiver_name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {orderData.receiver_address}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(orderData.total)}
          </p>
        </div>
        <div className="flex flex-col items-center gap-6">
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handlePayment}
          >
            Thanh toán ngay
          </Button>
          {loading && <Spin size="large" />}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
