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
import type { UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

const { Title } = Typography;

const ManageBrand = () => {
  const [brands, setBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBrand, setEditingBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [fileList, setFileList] = useState([]);
  const getSrcFromFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get("/brands");
      setBrands(response.data);
    } catch (error) {
      message.error("Failed to load brands");
    }
    setLoading(false);
  };

  const handleAddEditBrand = async (values) => {
    setSubmitLoading(true);
    try {
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        values.image = await uploadFile(fileList[0].originFileObj);
      } else if (editingBrand) {
        values.image = editingBrand.image; // Giữ nguyên ảnh cũ nếu không thay đổi
      }

      if (editingBrand) {
        await api.put(`/brands/${editingBrand.id}`, values);
        message.success("Brand updated successfully");
      } else {
        await api.post("/brands", values);
        message.success("Brand added successfully");
      }

      fetchBrands();
      handleCloseModal();
    } catch (error) {
      message.error("Failed to save brand");
    }
    setSubmitLoading(false);
  };

  const handleToggleStatus = async (id, isDeleted) => {
    setStatusLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.delete(`/brands/${id}`, { isDeleted: !isDeleted });
      message.success("Status updated successfully");
      fetchBrands();
    } catch (error) {
      message.error("Failed to update status");
    }
    setStatusLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEditBrand = (record) => {
    form.setFieldsValue(record);
    setEditingBrand(record);
    setIsModalVisible(true);

    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "logo.png",
          status: "done",
          url: record.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingBrand(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "image",
      key: "image",
      render: (logo) =>
        logo ? (
          <Image
            src={logo}
            alt="Brand Logo"
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Brand Name",
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
          loading={statusLoading[record.id] || false}
          onChange={() => handleToggleStatus(record.id, isDeleted)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEditBrand(record)}>
          Edit
        </Button>
      ),
    },
  ];

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
        Manage Brands
      </Title>
      <Button
        type="primary"
        onClick={() => {
          setIsModalVisible(true);
          setEditingBrand(null);
          form.resetFields();
          setFileList([]);
        }}
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
        loading={loading}
      >
        Add Brand
      </Button>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        bordered
        loading={loading}
        scroll={{ x: true }}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        centered
        width={500}
        confirmLoading={submitLoading}
      >
        <Form form={form} onFinish={handleAddEditBrand} layout="vertical">
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>
          <Form.Item label="Upload Logo">
            <ImgCrop showGrid rotationSlider aspectSlider showReset>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length === 0 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageBrand;
