import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/Layout';
import axios from '../../api/axios';
import {
  message,
  Table,
  Button,
  Modal,
  Form,
  Input,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

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
      await axios.post('/category/create', payload);
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
      width: '20%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'category_name',
      key: 'category_name',
      width: '60%',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
           
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.category_id)}
            danger
          />
        </div>
      ),
      width: '20%',
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Quản lý danh mục</h1>
      <div className="flex justify-between items-center mb-6 bg-white h-20 rounded-md px-7">
        <Input
          placeholder="Tìm kiếm danh mục..."
          onChange={handleSearch}
          style={{ width: '50%' }}
        />
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
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
            ]}
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
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategory;
