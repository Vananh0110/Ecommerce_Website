import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import axios from '../../api/axios';
import { notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, message) => {
    api[type]({
      message: title,
      description: message,
      placement: 'topRight',
      duration: 2,
      showProgress: true
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      openNotificationWithIcon(
        'error',
        'Mật khẩu không khớp',
        'Mật khẩu nhập lại không khớp. Vui lòng thử lại.'
      );
      return;
    }

    try {
      const response = await axios.post('/user/register', {
        user_name: userName,
        email: email,
        password: password,
        role_id: 2
      });
      console.log('Registration successful:', response.data);
      openNotificationWithIcon(
        'success',
        'Đăng ký thành công',
        'Bạn đã tạo tài khoản thành công.'
      );
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Đăng ký thất bại',
        error.response && error.response.data.message ? error.response.data.message : 'Đăng ký không thành công. Vui lòng thử lại.'
      );
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-12 w-auto" src={logo} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Tạo tài khoản mới
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border px-8 pt-6 pb-12 shadow-md rounded-2xl">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Tên
              </label>
              <input
                type="text"
                name="user_name"
                id="userName"
                autoComplete="name"
                required
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="flex justify-center w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Đăng ký
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Bạn đã có tài khoản?
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
