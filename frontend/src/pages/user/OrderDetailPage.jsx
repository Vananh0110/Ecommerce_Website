import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layouts/user/Layout';
import { Table, Tag, Button, message } from 'antd';
import axios from '../../api/axios';

const OrderDetailPage = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/order/${order_id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order detail:', error);
        message.error('Không thể tải chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order_id]);

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img
          src={`http://localhost:5000/${image}`}
          alt="Product"
          className="h-16 w-16 object-cover rounded"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(record.price * record.quantity),
    },
  ];

  if (!order) return null;

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng</h1>
        <div className="mb-6 flex flex-col gap-3">
          <p>
            <strong>Người nhận:</strong> {order.receiver_name}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.receiver_phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.receiver_address}
          </p>
          <p>
            <strong>Hình thức thanh toán:</strong>{' '}
            {order.payment_type === 'COD'
              ? 'Thanh toán khi nhận hàng'
              : 'Ngân hàng'}
          </p>
          <p>
            <strong>Trạng thái:</strong>{' '}
            <Tag color="blue">{order.order_status}</Tag>
          </p>
          <p>
            <strong>Tổng tiền:</strong>{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(order.total_money)}
          </p>
          <p>
            <strong>Ghi chú:</strong> {order.user_note || 'Không có'}
          </p>
        </div>
        <Table
          columns={columns}
          dataSource={order.items}
          rowKey="product_id"
          pagination={false}
          loading={loading}
        />
        <Button className="mt-6" onClick={() => navigate('/orders')}>
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;
