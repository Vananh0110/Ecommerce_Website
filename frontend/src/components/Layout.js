import React from 'react';
import { Input, Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const onSearch = (value) => console.log(value);
  return (
    <>
      <header className="bg-white w-full fixed z-10">
        <div className="max-w-7xl mx-auto py-4 w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="font-semibold text-lg">Logo</div>
            <div>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm"
                onSearch={onSearch}
                style={{ width: 400 }}
                enterButton
              />
            </div>
            <div className="flex space-x-3">
              <div className="font-semibold text-sm text-slate-500 hover:text-black cursor-pointer py-2 px-4">
                Đăng nhập
              </div>
              <button className="bg-red-500 text-sm text-white font-normal py-2 px-4 rounded">
                <ShoppingCartOutlined /> Giỏ hàng
              </button>
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
      <main className='bg-slate-100 pb-16'>
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
