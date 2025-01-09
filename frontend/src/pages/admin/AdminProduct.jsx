import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Pagination,
  Select,
  Modal,
  Upload,
  message,
  InputNumber,
  Form,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../layouts/admin/Layout';
import axios from '../../api/axios';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/category/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
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

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('status', values.status || 'active');
    formData.append('stock', values.stock || 0);
    formData.append('category_id', values.category_id);
    if (values.image) {
      formData.append('image', values.image.file.originFileObj);
    }

    try {
      const response = await axios.post('/product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Sản phẩm đã được thêm thành công!');
      setIsAddModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error('Thêm sản phẩm thất bại.');
      console.error(error);
    }
  };

  const showDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
  };

  const showDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`/product/${productToDelete.product_id}`);
      message.success('Sản phẩm đã được xóa thành công!');
      setIsDeleteModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Xóa sản phẩm thất bại.');
      console.error(error);
    }
  };

  const showEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalVisible(true);
  };

  const handleEditProduct = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('status', values.status);
    formData.append('stock', values.stock);
    formData.append('category_id', values.category_id);
    if (values.image?.file?.originFileObj) {
      formData.append('image', values.image.file.originFileObj);
    }

    try {
      await axios.put(`/product/${productToEdit.product_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Cập nhật sản phẩm thành công!');
      setIsEditModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Cập nhật sản phẩm thất bại.');
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Sản Phẩm</h1>
      <div className="flex justify-between mt-9 bg-white items-center h-20 px-7 mb-6 rounded-md">
        <div className="flex flex-row gap-3">
          <Search
            placeholder="Tìm kiếm theo tên hoặc giá"
            onChange={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            defaultValue="Sort"
            style={{ width: 120 }}
            onChange={handleSort}
          >
            <Option value="priceHigh">Giá cao đến thấp</Option>
            <Option value="priceLow">Giá thấp đến cao</Option>
            <Option value="AtoZ">A đến Z</Option>
            <Option value="ZtoA">Z đến A</Option>
          </Select>
        </div>
        <Button type="primary" onClick={showAddModal}>
          Thêm Sản Phẩm Mới
        </Button>
      </div>
      <Modal
        title="Thêm Sản Phẩm Mới"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
        centered
        width={760}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên Sản Phẩm"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Mô Tả">
                <TextArea />
              </Form.Item>
              <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="stock" label="Số Lượng">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="status" label="Trạng Thái">
                <Select defaultValue="In stock">
                  <Option value="In stock">In Stock</Option>
                  <Option value="Out of stock">Out of stock</Option>
                  <Option value="Discontinued">Discontinued</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="category_id"
                label="Danh Mục"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="image" label="Ảnh Sản Phẩm">
                <Upload name="image" listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải Ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
          .map((product) => (
            <div
              key={product.product_id}
              className="relative overflow-hidden hover:shadow-lg bg-white p-5 group cursor-pointer"
              onClick={() => showDetailModal(product)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    showEditModal(product);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  className="m-1"
                  color="danger"
                  variant="solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteModal(product);
                  }}
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

      <Modal
        title="Chi tiết sản phẩm"
        visible={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        centered
        width={760}
      >
        {selectedProduct && (
          <div className="flex flex-row gap-7">
            <div className="basis-1/2">
              <p>Tên sản phẩm: {selectedProduct.name}</p>
              <p>Mô tả: {selectedProduct.description}</p>
              <p>
                Giá:{' '}
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(selectedProduct.price)}
              </p>
              <p>Số lượng: {selectedProduct.stock}</p>
              <p>Trạng thái: {selectedProduct.status}</p>
            </div>
            <div className="basis-1/2">
              <img
                src={`http://localhost:5000/${selectedProduct.image}`}
                alt={selectedProduct.name}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa sản phẩm"
        visible={isDeleteModalVisible}
        onCancel={handleDeleteModalCancel}
        onOk={handleDeleteProduct}
        okText="Xóa"
        cancelText="Hủy"
        centered
        okButtonProps={{ style: { backgroundColor: 'red' } }}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}"?</p>
      </Modal>

      <Modal
        title="Chỉnh sửa sản phẩm"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        centered
        width={760}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={productToEdit} // Tải dữ liệu sản phẩm lên form
          onFinish={handleEditProduct} // Gửi dữ liệu đã chỉnh sửa
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên Sản Phẩm"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Mô Tả">
                <TextArea />
              </Form.Item>
              <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="stock" label="Số Lượng">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="status" label="Trạng Thái">
                <Select>
                  <Option value="In stock">In Stock</Option>
                  <Option value="Out of stock">Out of stock</Option>
                  <Option value="Discontinued">Discontinued</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="image" label="Ảnh Sản Phẩm">
                <Upload name="image" listType="picture-card">
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải Ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu Thay Đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProduct;
