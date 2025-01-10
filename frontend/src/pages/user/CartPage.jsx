import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/user/Layout';
import { Table, Button, InputNumber, message, Popconfirm } from 'antd';
import axios from '../../api/axios';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        message.error('Bạn cần đăng nhập để xem giỏ hàng.');
        return;
      }
      const response = await axios.get(`/cart/${user.user_id}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      message.error('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cart_id, quantity) => {
    try {
      if (quantity < 1) {
        message.error('Số lượng không hợp lệ.');
        return;
      }

      await axios.put(`/cart/${cart_id}`, { quantity });

      const updatedCart = cart.map((item) =>
        item.cart_id === cart_id ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      calculateTotalPrice(updatedCart);
      message.success('Cập nhật số lượng thành công.');
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error('Cập nhật số lượng thất bại.');
    }
  };

  const removeProduct = async (cart_id) => {
    try {
      await axios.delete(`/cart/${cart_id}`);
      const updatedCart = cart.filter((item) => item.cart_id !== cart_id);
      setCart(updatedCart);
      setSelectedProducts((prev) => prev.filter((id) => id !== cart_id));
      calculateTotalPrice(updatedCart);
      message.success('Xóa sản phẩm thành công.');
    } catch (error) {
      console.error('Error removing product:', error);
      message.error('Xóa sản phẩm thất bại.');
    }
  };

  const clearCart = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) return;

      await axios.delete(`/cart/delete-all/${user.user_id}`);
      setCart([]);
      setSelectedProducts([]);
      setTotalPrice(0);
      message.success('Đã xóa toàn bộ giỏ hàng.');
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error('Xóa giỏ hàng thất bại.');
    }
  };

  const calculateTotalPrice = (cartData = cart) => {
    const total = cartData
      .filter((item) => selectedProducts.includes(item.cart_id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedProducts(selectedRowKeys);
    calculateTotalPrice();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, cart]);

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`http://localhost:5000/${record.image}`}
            alt={record.name}
            className="h-16 w-16 object-cover rounded"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.cart_id, value)}
        />
      ),
    },
    {
      title: 'Tổng cộng',
      key: 'total',
      render: (_, record) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(record.price * record.quantity),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => removeProduct(record.cart_id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: onSelectChange,
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow mt-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Giỏ hàng</h1>
        <Table
          rowSelection={rowSelection} // Thêm tính năng chọn hàng
          columns={columns}
          dataSource={cart}
          rowKey="cart_id"
          loading={loading}
          pagination={false}
        />
        <div className="flex justify-between items-center mt-6">
          <Button danger onClick={clearCart}>
            Xóa toàn bộ giỏ hàng
          </Button>
          <h2 className="text-lg font-semibold">
            Tổng giá trị:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(totalPrice)}
          </h2>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              if (selectedProducts.length > 0) {
                const selectedItems = cart.filter((item) =>
                  selectedProducts.includes(item.cart_id)
                );
                navigate('/checkout', {
                  state: { items: selectedItems, total: totalPrice },
                });
              } else {
                message.error('Vui lòng chọn sản phẩm để thanh toán.');
              }
            }}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
