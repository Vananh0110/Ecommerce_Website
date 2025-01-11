import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/admin/Layout';
import { Table, Input, Button, Popconfirm, message, Modal, Form } from 'antd';
import axios from '../../api/axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [form] = Form.useForm();
  const [productIds, setProductIds] = useState([]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/comment/');
      setComments(response.data);
      setFilteredComments(response.data);
      const uniqueProductIds = Array.from(new Set(response.data.map((c) => c.product_id)));
      setProductIds(uniqueProductIds);
    } catch (error) {
      message.error('Không thể tải danh sách bình luận.');
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filtered = comments.filter((comment) =>
      comment.content.toLowerCase().includes(searchValue)
    );
    setFilteredComments(filtered);
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comment/${commentId}`);
      message.success('Bình luận đã được xóa thành công!');
      fetchComments();
    } catch (error) {
      message.error('Xóa bình luận thất bại.');
      console.error('Error deleting comment:', error);
    }
  };

  const columns = [
    {
        title: 'Mã sản phẩm',
        dataIndex: 'product_id',
        key: 'product_id',
        filters: productIds.map((id) => ({
          text: `${id}`,
          value: id,
        })),
        onFilter: (value, record) => record.product_id === value,
      },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
      key: 'product_name',
      width: '20%',
    },
    {
      title: 'Người dùng',
      dataIndex: 'user_name',
      key: 'user_name',
      width: '20%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: '30%',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) =>
        new Date(date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      width: '20%',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bình luận này?"
            onConfirm={() => handleDelete(record.comment_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
      width: '20%',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý bình luận</h1>
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Tìm kiếm bình luận..."
            onChange={handleSearch}
            style={{ width: '50%' }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="comment_id"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </Layout>
  );
};

export default AdminComment;
