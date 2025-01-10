import React, { useEffect, useState } from 'react';
import { Input, Menu, Avatar, Popover, Badge } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import axios from '../../api/axios';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({ totalItems: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    const storedUser = userString ? JSON.parse(userString) : null;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`/cart/${userId}`);
      const cartData = response.data;
      const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
      setCart(cartData.reverse().slice(0, 3));
      setCartSummary({ totalItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const accountOptions = (
    <div className="flex flex-col gap-3">
      <Link to="/user/profile" className="px-3 hover:text-red-500">
        Tài khoản
      </Link>
      <Link to="/orders" className="px-3 hover:text-red-500">
        Đơn mua
      </Link>
      <button
        onClick={() => {
          sessionStorage.clear();
          navigate('/login');
        }}
        className="px-3 hover:text-red-500"
      >
        Đăng xuất
      </button>
    </div>
  );

  const cartPopoverContent = (
    <div className="flex flex-col gap-3 pt-2 w-80">
      <p className="text-sm font-semibold text-slate-700">
        Tổng số sản phẩm: {cartSummary.totalItems}
      </p>
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div key={item.product_id} className="flex items-center gap-3">
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.name}
                className="h-14 w-14 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.quantity} x{' '}
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price)}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-sm text-slate-500">Giỏ hàng của bạn đang trống</p>
      )}
      <div className="flex justify-end">
        <button className="bg-red-500 text-white w-24 p-1 rounded-md ">
          Mua ngay
        </button>
      </div>
    </div>
  );

  const onSearch = (value) => console.log(value);
  return (
    <>
      <header className="bg-white w-full fixed z-10">
        <div className="max-w-7xl mx-auto py-4 w-full">
          <div className="flex flex-row justify-between items-center">
            <Link to="/" className="flex flex-col items-center">
              <img src={logo} style={{ height: '40px', width: '40px' }} />
              <div className="font-semibold text-lg">MotorOnline</div>
            </Link>
            <div>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm"
                onSearch={onSearch}
                style={{ width: 400 }}
                enterButton
              />
            </div>
            <div className="flex space-x-3 items-center">
              {user ? (
                <>
                  <Link to="/user/cart">
                    <Popover
                      content={cartPopoverContent}
                      trigger="hover"
                      onOpenChange={(visible) => {
                        if (visible) fetchCart(user.user_id);
                      }}
                    >
                      <Badge count={cartSummary.totalItems}>
                        <button className="bg-red-500 text-sm text-white font-normal py-2 px-4 rounded hover:opacity-85">
                          <ShoppingCartOutlined /> Giỏ hàng
                        </button>
                      </Badge>
                    </Popover>
                  </Link>
                  <Popover content={accountOptions} trigger="hover">
                    <div className="flex flex-row gap-3 items-center cursor-pointer">
                      {user.avatar ? (
                        <img
                          src={`http://localhost:5000/${user.avatar}`}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <Avatar size="large" icon={<UserOutlined />} />
                      )}
                      <span className="py-2 hover:text-red-500 ">
                        {user.user_name}
                      </span>
                    </div>
                  </Popover>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-semibold text-sm text-slate-500 hover:text-black cursor-pointer py-2"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="font-semibold text-sm text-slate-500 hover:text-black cursor-pointer py-2 px-4 border-s-2"
                  >
                    Đăng ký
                  </Link>
                  <button className="bg-red-500 text-sm text-white font-normal py-2 px-4 rounded">
                    <ShoppingCartOutlined /> Giỏ hàng
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <Menu mode="horizontal" theme="dark" className="pl-24 h-12">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="catalog" icon={<AppstoreOutlined />}>
            Sản phẩm
          </Menu.Item>
          <Menu.Item key="contact" icon={<ContactsOutlined />}>
            Liên hệ
          </Menu.Item>
        </Menu>
      </header>
      <main className="bg-slate-100 pb-36">
        <div
          className="mx-auto max-w-7xl"
          style={{ paddingTop: '155px' }}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
