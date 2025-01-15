import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/Layout';
import axios from '../../api/axios';
import {
  message,
  Table,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/user/all');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filtered);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        user_name: values.user_name,
        email: values.email,
        password: '12345678',
      };
      await axios.post('/user/register', payload);
      message.success('Người dùng mới đã được thêm thành công!');
      setIsAddModalVisible(false);
      addForm.resetFields();
      fetchUsersList();
    } catch (error) {
      message.error('Thêm người dùng thất bại.');
      console.error('Error adding user:', error);
    }
  };

  const handleEdit = (record) => {
    setCurrentUser(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/user/admin-update/${currentUser.user_id}`, values);
      message.success('Người dùng đã được chỉnh sửa thành công!');
      setIsEditModalVisible(false);
      fetchUsersList();
    } catch (error) {
      message.error('Cập nhật người dùng thất bại.');
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/user/${userId}`);
      message.success('Người dùng đã được xóa thành công!');
      fetchUsersList();
    } catch (error) {
      message.error('Xóa người dùng thất bại.');
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: '10%',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text, record) => (
        <Avatar
          size="large"
          src={`http://localhost:5000/${record.avatar}`}
          alt={record.user_name}
        />
      ),
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    // {
    //   title: 'Đơn hàng',
    //   dataIndex: 'total_orders',
    //   key: 'total_orders',
    // },
    // {
    //   title: 'Tổng tiền mua hàng',
    //   dataIndex: 'total_paid_amount',
    //   key: 'total_paid_amount',
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        let text;

        switch (status) {
          case 'Đang hoạt động':
            color = 'green';
            text = 'Đang hoạt động';
            break;
          case 'Không hoạt động':
            color = 'orange';
            text = 'Không hoạt động';
            break;
          case 'Khóa':
            color = 'red';
            text = 'Khóa';
            break;
          default:
            color = 'gray';
            text = 'Không xác định';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.user_id)}
            danger
          />
        </div>
      ),
      width: '15%',
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Quản lý người dùng</h1>
      <div className="flex justify-between items-center mb-6 bg-white h-20 rounded-md px-7">
        <Search
          placeholder="Tìm kiếm người dùng..."
          onChange={handleSearch}
          style={{ width: '50%' }}
        />
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm người dùng mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="user_id"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
      <Modal
        title="Chỉnh sửa thông tin khách hàng"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="user_name" label="Tên người dùng">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Không hoạt động">Không hoạt động</Option>
              <Option value="Khóa">Khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm người dùng mới"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddSubmit}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="user_name"
            label="Tên người dùng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUser;
