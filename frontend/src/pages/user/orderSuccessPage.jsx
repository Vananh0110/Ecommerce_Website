import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../layouts/user/Layout';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state || {};

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto text-center">
        <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
        <h1 className="text-3xl font-bold mt-4">Đặt hàng thành công!</h1>
        <p className="text-lg mt-4">
          Cảm ơn bạn đã mua hàng tại MotorOnline. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
        </p>
        {orderData.order_id && (
          <p className="text-lg mt-2">
            <strong>Mã đơn hàng:</strong> {orderData.order_id}
          </p>
        )}
        {orderData.total && (
          <p className="text-lg mt-2">
            <strong>Tổng giá trị:</strong>{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(orderData.total)}
          </p>
        )}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Quay lại trang chủ
          </Button>
          <Button
            size="large"
            onClick={() => navigate(`/user/order/${orderData.order_id}`)}
          >
            Xem chi tiết đơn hàng
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
