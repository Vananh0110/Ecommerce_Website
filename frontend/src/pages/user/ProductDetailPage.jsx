import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Layout from '../../layouts/user/Layout';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 1));
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
            <button className="py-3 border w-56 border-red-500 text-red-500 bg-orange-50 hover:opacity-75">Thêm Vào Giỏ Hàng</button>
            <button className="py-3 bg-red-500 w-56 text-white hover:opacity-85">Mua Ngay</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
