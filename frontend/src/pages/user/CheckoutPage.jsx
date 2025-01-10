import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../layouts/user/Layout';
import { Form, Input, Button, Radio, List, message } from 'antd';
import axios from '../../api/axios';

const CheckoutPage = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState('COD');
  const [loading, setLoading] = useState(false); 
  const [form] = Form.useForm(); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    console.log('User from sessionStorage:', userData);
    setUser(userData);

    if (userData) {
      form.setFieldsValue({
        receiver_name: userData.user_name,
        receiver_phone: userData.phone_number,
        receiver_address: userData.address,
      });
    }
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (!user) {
        message.error('Bạn cần đăng nhập để thực hiện thanh toán.');
        return;
      }

      const payload = {
        user_id: user.user_id,
        total_money: state.total,
        payment_type: paymentType,
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        receiver_address: values.receiver_address,
        user_note: values.user_note,
        items: state.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      if (paymentType === 'COD') {
        const response = await axios.post('/order', payload);
        const cartIds = state.items.map((item) => item.cart_id);
        await axios.post('/cart/delete-selected', { cart_ids: cartIds });
        message.success('Đặt hàng thành công!');
        navigate('/order-success', {
          state: {
            order_id: response.data.order_id,
            total: state.total,
          },
        });
      } else if (paymentType === 'Banking') {
        const response = await axios.post('/order', payload);
        const cartIds = state.items.map((item) => item.cart_id);
        await axios.post('/cart/delete-selected', { cart_ids: cartIds });
        navigate('/payment', {
          state: {
            order_id: response.data.order_id,
            total: state.total,
            receiver_name: payload.receiver_name,
            receiver_address: payload.receiver_address,
          },
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      message.error('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>

        {/* Danh sách sản phẩm */}
        <List
          dataSource={state.items}
          renderItem={(item) => (
            <List.Item>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <span>{item.name}</span>
                </div>
                <span>
                  {item.quantity} x{' '}
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price)}
                </span>
              </div>
            </List.Item>
          )}
        />
        <div className="mt-6">
          <h2 className="text-lg font-semibold">
            Tổng giá trị:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(state.total)}
          </h2>
        </div>

        {/* Form thanh toán */}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            name="receiver_name"
            label="Tên người nhận"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người nhận.' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="receiver_phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại.' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="receiver_address"
            label="Địa chỉ giao hàng"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="user_note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán">
            <Radio.Group
              onChange={(e) => setPaymentType(e.target.value)}
              value={paymentType}
            >
              <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
              <Radio value="Banking">Thanh toán qua ngân hàng</Radio>
            </Radio.Group>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="mt-4"
          >
            Xác nhận Thanh toán
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
