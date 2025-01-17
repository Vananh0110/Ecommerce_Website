import React, { useState, useEffect } from 'react';
import Layout from '../../layouts/user/Layout';
import { Input, Select, Pagination } from 'antd';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/product/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/category/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getFilteredProducts = () => {
    return products
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm) &&
          (selectedCategory === '' || product.category_id === selectedCategory)
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'priceHighToLow') return b.price - a.price;
        if (sortOrder === 'priceLowToHigh') return a.price - b.price;
        if (sortOrder === 'AtoZ') return a.name.localeCompare(b.name);
        if (sortOrder === 'ZtoA') return b.name.localeCompare(a.name);
        return 0;
      });
  };

  const filteredProducts = getFilteredProducts();
  const totalProducts = filteredProducts.length;
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            onChange={handleSearchChange}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Chọn danh mục"
            onChange={handleCategoryChange}
            style={{ width: 200 }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Sắp xếp"
            onChange={handleSortChange}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="priceHighToLow">Giá cao đến thấp</Option>
            <Option value="priceLowToHigh">Giá thấp đến cao</Option>
            <Option value="AtoZ">Tên từ A đến Z</Option>
            <Option value="ZtoA">Tên từ Z đến A</Option>
          </Select>
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
                <p className="text-red-600 font-medium">
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
          {totalProducts > pageSize && (
            <Pagination
              align="center"
              current={currentPage}
              onChange={handlePageChange}
              total={totalProducts}
              pageSize={pageSize}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductListPage;
