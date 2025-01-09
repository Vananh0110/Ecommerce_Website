import React, { useEffect, useState } from 'react';
import { Input, Button, Pagination, Select } from 'antd';
import AdminLayout from '../../layouts/admin/Layout';
import axios from '../../api/axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/product/');
      setProducts(response.data);
      setDisplayProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.price.toString().includes(value)
    );
    setDisplayProducts(filtered);
  };

  const handleSort = (value) => {
    let sortedProducts = [...displayProducts];
    if (value === 'priceHigh') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (value === 'priceLow') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'AtoZ') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === 'ZtoA') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    setDisplayProducts(sortedProducts);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="flex justify-between mt-9 bg-white items-center h-20 px-7 mb-6 rounded-md">
        <div className="flex flex-row gap-3">
          <Search
            placeholder="Search by name or price"
            onChange={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            defaultValue="Sort"
            style={{ width: 120 }}
            onChange={handleSort}
          >
            <Option value="priceHigh">Price High to Low</Option>
            <Option value="priceLow">Price Low to High</Option>
            <Option value="AtoZ">A to Z</Option>
            <Option value="ZtoA">Z to A</Option>
          </Select>
        </div>
        <Button
          type="primary"
          onClick={() => {
            /* navigate to add product page */
          }}
        >
          Add New Product
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .map((product) => (
            <div
              key={product.id}
              className="relative overflow-hidden hover:shadow-lg bg-white p-5 group"
            >
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <p className="text-base font-semibold">{product.name}</p>
                <p className="text-base text-red-500 font-medium">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price)}
                </p>
                <p>Còn: {product.stock} sản phẩm</p>
              </div>
              <div className="absolute top-0 right-0 p-2 hidden group-hover:flex">
                <Button
                  icon={<EditOutlined />}
                  className="m-1"
                  color="green"
                  variant="solid"
                />
                <Button
                  icon={<DeleteOutlined />}
                  className="m-1"
                  color="danger"
                  variant="solid"
                />
              </div>
            </div>
          ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={displayProducts.length}
        onChange={handlePageChange}
        showSizeChanger={false}
        className="mt-10"
        align="center"
      />
    </AdminLayout>
  );
};

export default AdminProduct;
