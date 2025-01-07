import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Layout from '../../components/Layout';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});

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

  return (
    <Layout>
      <div className="pt-6 flex flex-row gap-8">
        <div className="basis-2/5">
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
          />
        </div>
        <div className="basis-3/5">
          <h1 className="text-3xl font-bold pb-6">{product.name}</h1>
          <p className="text-2xl text-red-600 font-semibold pb-6">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
          </p>
          <p className="font-semibold text-lg pb-4">Mô tả sản phẩm:</p>
          <p className="text-lg">{product.description}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
