import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('1');

  useEffect(() => {
    const pathMap = {
      '/admin/dashboard': '1',
      '/admin/users': '2',
      '/admin/categories': '3',
      '/admin/products': '4',
      '/admin/orders': '5',
      '/admin/comments': '6',
    };
    setSelectedKey(pathMap[location.pathname] || '1');
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Bảng Điều Khiển</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Khách Hàng</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}>
            <Link to="/admin/categories">Danh mục</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ShopOutlined />}>
            <Link to="/admin/products">Sản Phẩm</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<CommentOutlined />}>
            <Link to="/admin/comments">Bình luận</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng Xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="bg-slate-100" style={{ marginLeft: 200 }}>
        {/* <Header
          style={{
            padding: 0,
            background: '#fff',
            textAlign: 'center',
            position: 'fixed',
            zIndex: 100,
            width: 'calc(100% - 200px)',
          }}
        >
          Header Content
        </Header> */}
        <Content
          style={{
            margin: '28px 16px 0',
            overflow: 'initial',
            minHeight: '280px',
            padding: '24px',
          }}
        >
          {children}
        </Content>
        <Footer className=""></Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
