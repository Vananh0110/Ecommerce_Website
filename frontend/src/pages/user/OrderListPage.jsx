import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/user/Layout';
import { Table, Tag, Button, message } from 'antd';
import axios from '../../api/axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
          message.error('Bạn cần đăng nhập để xem danh sách đơn hàng.');
          return;
        }
        const response = await axios.get(`/order/user/${user.user_id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => {
        let color = 'gray';
        if (status === 'Chờ xử lý') color = 'blue';
        if (status === 'Đang xử lý') color = 'orange';
        if (status === 'Đã gửi hàng') color = 'green'
        if (status === 'Đang giao hàng') color = 'yellow';
        if (status === 'Hoàn thành') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'payment_type',
      key: 'payment_type',
      render: (type) =>
        type === 'COD' ? 'Thanh toán khi nhận hàng' : 'Ngân hàng',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (total) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(total),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) =>
        new Date(date).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/orders/${record.order_id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto min-h-96">
        <h1 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h1>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="order_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </Layout>
  );
};

export default OrderListPage;
