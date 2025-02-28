import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Typography,
  Card,
  Switch,
  Image,
  UploadFile,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../../../config/api";
import uploadFile from "../../../../utils/uploadFile";
import type { GetProp, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
const { Title } = Typography;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  const handleAddEditCategory = async (values) => {
    console.log(values);
    console.log(fileList[0].originFileObj);
    const urlFile = fileList[0].originFileObj;
    const urlLink = await uploadFile(urlFile);
    values.image = urlLink;
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, values);
        message.success("Category updated successfully");
      } else {
        await api.post("/categories", values);
        message.success("Category added successfully");
      }
      fetchCategories();
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      setImagePreview(null);
    } catch (error) {
      message.error("Failed to save category");
    }
  };

  const handleToggleStatus = async (id, isDeleted) => {
    try {
      await api.delete(`/categories/${id}`, { isDeleted: !isDeleted });
      message.success("Status updated successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleImageChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={image}
          alt="Category"
          style={{
            width: 150,
            height: 150,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },

    {
      title: "Status",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted, record) => (
        <Switch
          checked={!isDeleted}
          onChange={() => handleToggleStatus(record.id, isDeleted)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            form.setFieldsValue(record);
            setEditingCategory(record);
            setImagePreview(record.image);
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Card
      style={{
        margin: 20,
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        Manage Categories
      </Title>

      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
      >
        Add Category
      </Button>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        className="bg-white p-4"
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
          setImagePreview(null);
        }}
        onOk={() => form.submit()}
        centered
        width={500}
      >
        <Form form={form} onFinish={handleAddEditCategory} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            //rules={[{ required: true, message: "Please upload an image" }]}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length == 0 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageCategory;
