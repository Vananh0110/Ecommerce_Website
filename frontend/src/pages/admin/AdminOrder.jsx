import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Select, Popconfirm, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from '../../api/axios';
import AdminLayout from '../../layouts/admin/Layout';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/order/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`/order/${orderId}`, { order_status: status });
      message.success('Cập nhật trạng thái đơn hàng thành công!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Cập nhật trạng thái đơn hàng thất bại.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/order/${orderId}`);
      message.success('Đơn hàng đã được xóa thành công.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Xóa đơn hàng thất bại.');
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(`/order/${orderId}`);
      setSelectedOrder(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Không thể tải chi tiết đơn hàng.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'receiver_name',
      key: 'receiver_name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'receiver_phone',
      key: 'receiver_phone',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'user_note',
      key: 'user_note',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_money',
      sorter: (a, b) => a.total_money - b.total_money,
      render: (total) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(total),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      key: 'order_status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Shipped', value: 'Shipped' },
        { text: 'Paid', value: 'Paid' },
        { text: 'Delivered', value: 'Delivered' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.order_status === value,
      render: (status) => {
        let color = 'gray';
        if (status === 'Pending') color = 'blue';
        if (status === 'Shipped') color = 'orange';
        if (status === 'Paid') color = 'green';
        if (status === 'Delivered') color = 'yellow';
        if (status === 'Cancelled') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) =>
        new Date(date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-3">
          <Button
            icon={<EyeOutlined />}
            type="primary"
            onClick={() => handleViewDetails(record.order_id)}
          >
            Chi tiết
          </Button>
          <Select
            defaultValue={record.order_status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.order_id, value)}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Paid">Paid</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
            <Select.Option value="Shipped">Shipped</Select.Option>
            <Select.Option value="Cancelled">Cancelled</Select.Option>
          </Select>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này không?"
            onConfirm={() => handleDeleteOrder(record.order_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded shadow mt-6">
        <h1 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h1>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="order_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.order_id || ''}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={800}
      >
        {selectedOrder ? (
          <div>
            <p>
              <strong>Tên người nhận:</strong> {selectedOrder.receiver_name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedOrder.receiver_phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedOrder.receiver_address}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{' '}
              {selectedOrder.payment_type}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{' '}
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(selectedOrder.total_money)}
            </p>

            <h3 className="mt-4">Sản phẩm trong đơn hàng:</h3>
            <Table
              dataSource={selectedOrder.items}
              rowKey="product_id"
              pagination={false}
              columns={[
                {
                  title: 'Ảnh sản phẩm',
                  dataIndex: 'image',
                  key: 'image',
                  render: (text) => (
                    <img
                      src={`http://localhost:5000/${text}`}
                      alt="product"
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                      }}
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
                  title: 'Đơn giá',
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
                    }).format(record.quantity * record.price),
                },
              ]}
            />
          </div>
        ) : (
          <p>Đang tải chi tiết đơn hàng...</p>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrder;
