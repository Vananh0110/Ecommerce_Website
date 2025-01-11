import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/Layout';
import { Card, Row, Col, Spin, message, Table } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import axios from '../../api/axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [paymentStats, setPaymentStats] = useState({ COD: 0, Banking: 0 });
  const [categories, setCategories] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const response = await axios.get('/user/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      message.error('Không thể tải dữ liệu thống kê.');
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await axios.get('/order/');
      const orders = response.data;

      const codCount = orders.filter(
        (order) => order.payment_type === 'COD'
      ).length;
      const bankingCount = orders.filter(
        (order) => order.payment_type === 'Banking'
      ).length;

      setPaymentStats({ COD: codCount, Banking: bankingCount });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      message.error('Không thể tải dữ liệu hình thức thanh toán.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/category/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Không thể tải dữ liệu danh mục.');
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get('/order/revenue-monthly');
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      message.error('Không thể tải dữ liệu doanh thu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get('/order/newest');
      console.log("Order:", response.data);
      setRecentOrders(response.data);
    } catch (error) {
      console.error('Error fetching recent orders:', error);  
      message.error('Không thể tải đơn hàng mới nhất.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchStats();
      await fetchPaymentStats();
      await fetchCategories();
      await  fetchRevenueData();
      await fetchRecentOrders();
      setLoading(false);
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: 'Khách hàng',
      value: stats?.total_customers,
      icon: <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      link: '/admin/users',
    },
    {
      title: 'Danh mục',
      value: stats?.total_categories,
      icon: <AppstoreOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      link: '/admin/categories',
    },
    {
      title: 'Đơn hàng',
      value: stats?.total_orders,
      icon: <ShoppingCartOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      link: '/admin/orders',
    },
    {
      title: 'Tổng tiền đã thanh toán',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(stats?.total_paid || 0),
      icon: <DollarCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />,
      link: '/admin/orders',
    },
  ];

  const paymentChartData = {
    labels: ['COD', 'Banking'],
    datasets: [
      {
        data: [paymentStats.COD, paymentStats.Banking],
        backgroundColor: ['#4caf50', '#2196f3'],
        hoverBackgroundColor: ['#66bb6a', '#42a5f5'],
      },
    ],
  };

  const paymentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê hình thức thanh toán',
      },
    },
  };

  const categoryChartData = {
    labels: categories.map((category) => category.category_name),
    datasets: [
      {
        label: 'Số lượng sản phẩm',
        data: categories.map((category) => category.product_count),
        backgroundColor: '#1890ff',
        borderColor: '#0050b3',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Số lượng sản phẩm theo danh mục',
      },
    },
  };

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: revenueData ? revenueData.map((month) => month.total_revenue) : [],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
      {
        label: 'Số lượng đơn hàng',
        data: revenueData ? revenueData.map((month) => month.total_orders) : [],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu theo tháng',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('vi-VN').format(value);
            }
            return value;
          },
        },
      },
    },
  };

  const recentOrdersColumns = [
    {
      title: 'ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Người nhận',
      dataIndex: 'receiver_name',
      key: 'receiver_name',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (money) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(money),
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) =>
        new Date(date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      key: 'order_status',
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Bảng điều khiển</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-6">
            {cards.map((card, index) => (
              <Col xs={24} md={12} lg={6} key={index}>
                <Card
                  hoverable
                  onClick={() => navigate(card.link)}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  {card.icon}
                  <p className="text-lg font-semibold mt-2">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="flex flex-grow gap-6">
            <Card className="basis-1/3 hover:shadow-md">
              <Pie data={paymentChartData} options={paymentChartOptions} />
            </Card>

            <Card className="basis-2/3 hover:shadow-md">
              <Bar className="w-full" data={categoryChartData} options={categoryChartOptions} />
            </Card>
          </div>
          <div className="bg-white p-6 rounded shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4">Đơn hàng mới nhất</h2>
            <Table
              columns={recentOrdersColumns}
              dataSource={recentOrders}
              rowKey="order_id"
              pagination={false}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
