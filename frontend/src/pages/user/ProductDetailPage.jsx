import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Layout from '../../layouts/user/Layout';
import { PlusOutlined, MinusOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Form, Input, Button, List, Avatar, Upload } from 'antd';

const { TextArea } = Input;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/product/${productId}`);
      setProduct(response.data);
      fetchProduct();
    } catch (error) {
      console.error('Failed to fetch product details', error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/comment/by-product/${productId}`);
      setComments(response.data);
      fetchComments();
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchComments();
  }, [productId]);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 1));
  };

  const addToCart = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const user_id = user?.user_id;
    const quantityToAdd = quantity > 0 ? quantity : 1;

    try {
      await axios.post('/cart/', {
        user_id,
        product_id: productId,
        quantity: quantityToAdd,
      });
      message.success('Sản phẩm đã được thêm vào giỏ hàng!');
    } catch (error) {
      message.error('Thêm vào giỏ hàng thất bại!');
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddComment = async (values) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      return message.error('Vui lòng đăng nhập để bình luận.');
    }

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('user_id', user.user_id);
    formData.append('content', values.content);
    if (values.image) {
      formData.append('image', values.image.file);
    }

    try {
      setLoading(true);
      const response = await axios.post('/comment/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setComments((prev) => [response.data, ...prev]);
      form.resetFields();
      message.success('Thêm bình luận thành công!');
    } catch (error) {
      console.error('Failed to add comment', error);
      message.error('Thêm bình luận thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mt-10 flex flex-row gap-12 w-full bg-white p-6">
        <div className="basis-2/5">
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
          />
        </div>
        <div className="basis-3/5 px-4 pb-6">
          <h1 className="text-3xl font-bold mb-5">{product.name}</h1>
          <p className="text-2xl text-red-600 font-semibold mb-6">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
          </p>
          <p className="font-semibold text-lg mb-3">Mô tả sản phẩm:</p>
          <p className="text-lg">{product.description}</p>
          <div className="flex items-center mt-9">
            <p className="font-semibold text-lg mr-8">Số lượng:</p>
            <div className="flex flex-row mr-4">
              <button
                onClick={decrementQuantity}
                className="text-sm py-1 border px-3 hover:bg-black hover:text-white"
              >
                <MinusOutlined />
              </button>
              <div className="text-lg border py-1 px-6">{quantity}</div>
              <button
                onClick={incrementQuantity}
                className="text-sm py-1 border px-3 hover:bg-black hover:text-white"
              >
                <PlusOutlined />
              </button>
            </div>
            <div className="text-slate-500 font-medium text-base">
              {product.stock} sản phẩm có sẵn
            </div>
          </div>
          <div className="flex flex-row gap-3 mt-12">
            <button
              onClick={addToCart}
              className="py-3 border w-56 border-red-500 text-red-500 bg-orange-50 hover:opacity-75"
            >
              Thêm Vào Giỏ Hàng
            </button>
            <button className="py-3 bg-red-500 w-56 text-white hover:opacity-85">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Bình luận</h2>
        <div className="flex flex-row">
          <List
            className="basis-1/2 border-r"
            itemLayout="vertical"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`http://localhost:5000/${comment.avatar}`}
                      alt={comment.user_name}
                    />
                  }
                  title={
                    <strong>
                      {comment.user_name}{' '}
                      <span className="text-slate-400 font-thin text-sm">
                        {new Date(comment.created_at).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </strong>
                  }
                  description={comment.content}
                />
                {comment.image && (
                  <img
                    src={`http://localhost:5000/${comment.image}`}
                    alt="Comment"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 4,
                      marginLeft: 60,
                      objectFit: 'cover',
                    }}
                  />
                )}
              </List.Item>
            )}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddComment}
            className="basis-1/2 pl-10"
          >
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập nội dung bình luận.',
                },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="image" label="Ảnh (tùy chọn)">
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm bình luận
            </Button>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
