import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/Layout';
import axios from '../../api/axios';
import { message, Table, Button, Modal, Form, Input, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/category/');
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục.');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(searchValue)
    );
    setFilteredCategories(filtered);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        category_name: values.category_name,
      };
      await axios.post('/category/', payload);
      message.success('Danh mục mới đã được thêm thành công!');
      setIsAddModalVisible(false);
      addForm.resetFields();
      fetchCategories();
    } catch (error) {
      message.error('Thêm danh mục thất bại.');
      console.error('Error adding category:', error);
    }
  };

  const handleEdit = (record) => {
    setCurrentCategory(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/category/${currentCategory.category_id}`, values);
      message.success('Danh mục đã được chỉnh sửa thành công!');
      setIsEditModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Cập nhật danh mục thất bại.');
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`/category/${categoryId}`);
      message.success('Danh mục đã được xóa thành công!');
      fetchCategories();
    } catch (error) {
      message.error('Xóa danh mục thất bại.');
      console.error('Error deleting category:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'category_id',
      key: 'category_id',
      width: '10%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'category_name',
      key: 'category_name',
      width: '40%',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'product_count',
      key: 'product_count',
      sorter: (a, b) => a.product_count - b.product_count,
      width: '20%',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={(event) => {
              event.stopPropagation();
              handleDelete(record.category_id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={(event) => event.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ),
      width: '20%',
    },
  ];

  const handleRowClick = async (record) => {
    try {
      const response = await axios.get(
        `/product/category/${record.category_id}`
      );
      setProducts(response.data);
      setCurrentCategoryName(record.category_name);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải danh sách sản phẩm.');
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(categories);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    const exportFileName = 'CategoryList.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Quản lý danh mục</h1>
      <div className="flex justify-between items-center mb-6 bg-white h-20 rounded-md px-7">
        <div>
          <Input
            placeholder="Tìm kiếm danh mục..."
            onChange={handleSearch}
            style={{ width: '250px' }}
          />
          <Button
            icon={<ExportOutlined />}
            onClick={handleExport}
            style={{ marginLeft: 8 }}
          >
            Xuất file excel
          </Button>
        </div>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm danh mục mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="category_id"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        title="Chỉnh sửa danh mục"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="category_name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm danh mục mới"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddSubmit}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="category_name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Danh sách sản phẩm trong danh mục: ${currentCategoryName}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={products}
          rowKey="product_id"
          bordered
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
          }}
          columns={[
            {
              title: 'STT',
              key: 'index',
              render: (text, record, index) => index + 1,
              width: '10%',
            },
            {
              title: 'Tên sản phẩm',
              dataIndex: 'name',
              key: 'name',
              width: '40%',
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
              width: '25%',
            },
            {
              title: 'Số lượng',
              dataIndex: 'stock',
              key: 'stock',
              width: '25%',
            },
          ]}
        />
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategory;
