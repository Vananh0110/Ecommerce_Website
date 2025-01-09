import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/user/Layout';
import { Carousel, Pagination } from 'antd';
import banner1 from '../../assets/images/banner1.jpg';
import banner2 from '../../assets/images/banner2.jpg';
import banner3 from '../../assets/images/banner3.jpg';
import axios from '../../api/axios';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/category/');
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/product/');
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.category_id);
    if (category.category_id) {
      const filtered = products.filter(
        (product) => product.category_id === category.category_id
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <Carousel autoplay>
        <div>
          <img
            src={banner1}
            alt="banner1"
            style={{ width: '100%', height: '550px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <img
            src={banner2}
            alt="banner2"
            style={{ width: '100%', height: '550px', objectFit: 'cover' }}
          />
        </div>
        <div>
          <img
            src={banner3}
            alt="banner3"
            style={{ width: '100%', height: '550px', objectFit: 'cover' }}
          />
        </div>
      </Carousel>
      <div className="pt-6 flex flex-row gap-6">
        <div className="basis-1/4">
          <div className="bg-white">
            <div className="bg-black text-white text-base font-medium py-2 pl-3">
              <UnorderedListOutlined className="pr-3" />
              DANH MỤC SẢN PHẨM
            </div>
            <div>
              {categories.map((category) => (
                <div
                  key={category.category_id}
                  className={`py-2 pl-3 border-t text-base cursor-pointer text-slate-500 hover:text-black ${
                    activeCategory === category.category_id
                      ? 'bg-blue-100 text-black'
                      : 'hover:bg-blue-100'
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.category_name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="basis-3/4 bg-white p-4">
          <div className="pb-4 px-3 text-lg">
            {filteredProducts.length} sản phẩm
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProducts.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
              >
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold text-slate-700">
                    {product.name}
                  </h3>
                  <p className="text-base font-medium text-red-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            {filteredProducts.length > pageSize && (
              <Pagination
                align="center"
                current={currentPage}
                onChange={handleChangePage}
                total={filteredProducts.length}
                pageSize={pageSize}
                showSizeChanger={false}
                
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
