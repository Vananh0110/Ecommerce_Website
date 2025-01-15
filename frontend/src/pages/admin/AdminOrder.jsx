import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Popconfirm,
  message,
  Modal,
  Tabs,
} from 'antd';
import { EyeOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import axios from '../../api/axios';
import AdminLayout from '../../layouts/admin/Layout';
import * as XLSX from 'xlsx';

const { TabPane } = Tabs;

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Chờ xử lý');

  const orderStatuses = [
    { key: 'Chờ xử lý', text: 'Chờ xử lý' },
    { key: 'Đang xử lý', text: 'Đang xử lý' },
    { key: 'Đã gửi hàng', text: 'Đã gửi hàng' },
    { key: 'Đang giao hàng', text: 'Đang giao hàng' },
    { key: 'Đã giao hàng', text: 'Đã giao hàng' },
    { key: 'Hoàn thành', text: 'Hoàn thành' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/order/');
      console.log(response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/order/${orderId}`, { order_status: newStatus });
      setOrders(
        orders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      );
      setActiveTab(newStatus);
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Cập nhật trạng thái đơn hàng thất bại.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/order/${orderId}`);
      fetchOrders();
      message.success('Đơn hàng đã được xóa thành công.');
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
      key: 'total_money',
      sorter: (a, b) => a.total_money - b.total_money,
      render: (total) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(total),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment_type',
      key: 'payment_type',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => {
        let color = 'gray';
        if (status === 'Chờ xử lý') color = 'blue';
        if (status === 'Đang xử lý') color = 'orange';
        if (status === 'Đã gửi hàng') color = 'green';
        if (status === 'Đang giao hàng') color = 'yellow';
        if (status === 'Hoàn thành') color = 'red';
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
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
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
        <div className="flex gap-2">
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
            onChange={(newStatus) =>
              handleStatusChange(record.order_id, newStatus)
            }
          >
            {orderStatuses.map((status) => (
              <Select.Option key={status.key} value={status.key}>
                {status.text}
              </Select.Option>
            ))}
          </Select>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này không?"
            onConfirm={() => handleDeleteOrder(record.order_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const exportFileName = 'OrderList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded shadow mt-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold ">Quản lý đơn hàng</h1>
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
            style={{ marginRight: 8 }}
            type="primary"
          >
            Xuất file Excel
          </Button>
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          {orderStatuses.map((status) => (
            <TabPane tab={status.text} key={status.key}>
              <Table
                columns={columns}
                dataSource={orders.filter(
                  (order) => order.order_status === status.key
                )}
                rowKey="order_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>

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
