import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import axios from '../../api/axios';
import { notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, message) => {
    api[type]({
      message: title,
      description: message,
      placement: 'topRight',
      duration: 2,
      showProgress: true,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/user/login', { email, password });
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        openNotificationWithIcon(
          'success',
          'Đăng nhập thành công',
          'Bạn đã đăng nhập thành công vào hệ thống.'
        );
        setTimeout(() => {
          if (response.data.user.role_id === 1) {
            navigate('/admin/dashboard');
          } else if (response.data.role_id === 2) {
            navigate('/');
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        throw new Error('Dữ liệu người dùng không tồn tại trong phản hồi');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      openNotificationWithIcon(
        'error',
        'Đăng nhập thất bại',
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Đăng nhập không thành công. Vui lòng thử lại.'
      );
    }
  };
  return (
    <>
      {contextHolder}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src={logo} />
          <h2 className="mt-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border px-10 pt-8 pb-16 shadow-md rounded-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                for="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  for="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Bạn chưa có tài khoản?
            <Link
              to="/register"
              className="ml-2 font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
