import React, { useEffect, useState } from 'react';
import { Input, Menu, Avatar, Popover } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    const storedUser = userString ? JSON.parse(userString) : null;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const accountOptions = (
    <div className="flex flex-col gap-3">
      <Link to="/user/profile" className="px-3 hover:text-red-500">
        Tài khoản
      </Link>
      <Link to="/user/order" className="px-3 hover:text-red-500">
        Đơn mua
      </Link>
      <button
        onClick={() => {
          sessionStorage.clear();
          navigate('/');
        }}
        className="px-3 hover:text-red-500"
      >
        Đăng xuất
      </button>
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
                  <button className="bg-red-500 text-sm text-white font-normal py-2 px-4 rounded hover:opacity-85">
                    <ShoppingCartOutlined /> Giỏ hàng
                  </button>
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
      <main className="bg-slate-100 pb-16">
        <div
          className="mx-auto w-full max-w-7xl"
          style={{ paddingTop: '130px' }}
        >
          {children}
        </div>
      </main>
      <footer className=""></footer>
    </>
  );
};

export default Layout;
