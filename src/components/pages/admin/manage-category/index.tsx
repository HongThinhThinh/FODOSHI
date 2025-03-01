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
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import api from "../../../../config/api";
import uploadFile from "../../../../utils/uploadFile";

const { Title } = Typography;

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [croppedFileObj, setCroppedFileObj] = useState<File | null>(null);
  const [fileList, setFileList] = useState([]);
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Converts a file object to a data URL using FileReader.
   *
   * @param {Object} file - The file object containing the original file.
   * @returns {Promise<string>} A promise that resolves to the data URL of the file.
   */

  /******  9a3e7927-01f3-41a9-9655-94cd07abb18b  *******/
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

  // const onPreview = async (file) => {
  //   const src = file.url || (await getSrcFromFile(file));
  //   const imgWindow = window.open(src);

  //   if (imgWindow) {
  //     const image = new Image();
  //     image.src = src;
  //     imgWindow.document.write(image.outerHTML);
  //   } else {
  //     window.location.href = src;
  //   }
  // };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to load categories");
    }
    setLoading(false);
  };

  const handleAddEditCategory = async (values) => {
    setSubmitLoading(true);
    try {
      // Sử dụng file đã crop nếu có
      if (croppedFileObj) {
        values.image = await uploadFile(croppedFileObj);
      } else if (fileList.length > 0 && fileList[0]?.originFileObj) {
        // Fallback to original file if no cropped file
        values.image = await uploadFile(fileList[0].originFileObj);
      } else if (editingCategory) {
        values.image = editingCategory.image; // Giữ nguyên ảnh cũ nếu không thay đổi
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, values);
        message.success("Category updated successfully");
      } else {
        await api.post("/categories", values);
        message.success("Category added successfully");
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      message.error("Failed to save category");
    }
    setSubmitLoading(false);
  };

  const handleToggleStatus = async (id, isDeleted) => {
    setStatusLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.delete(`/categories/${id}`, { isDeleted: !isDeleted });
      message.success("Status updated successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to update status");
    }
    setStatusLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEditCategory = (record) => {
    form.setFieldsValue(record);
    setEditingCategory(record);
    setIsModalVisible(true);
    setCroppedFileObj(null);

    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
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
    setEditingCategory(null);
    form.resetFields();
    setFileList([]);
    setCroppedFileObj(null);
  };

  // Xử lý khi người dùng crop ảnh xong
  const onCropComplete = (file: RcFile) => {
    setCroppedFileObj(file as File);
    return false; // Trả về false để ngăn Upload tự động upload
  };

  // Cập nhật fileList khi người dùng chọn ảnh mới

  return (
    <>
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
          onClick={() => {
            setIsModalVisible(true);
            setEditingCategory(null);
            form.resetFields();
            setFileList([]);
            setCroppedFileObj(null);
          }}
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
          loading={loading}
        >
          Add Category
        </Button>

        <Table
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              key: "image",
              render: (image) =>
                image ? (
                  <Image
                    src={image}
                    alt="Category"
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
                  loading={statusLoading[record.id] || false}
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
                  onClick={() => handleEditCategory(record)}
                >
                  Edit
                </Button>
              ),
            },
          ]}
          dataSource={categories}
          rowKey="id"
          bordered
          loading={loading}
          scroll={{ x: true }}
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title={editingCategory ? "Edit Category" : "Add Category"}
          open={isModalVisible} // Sử dụng 'open' thay vì 'visible' cho antd v5
          onCancel={handleCloseModal}
          onOk={() => form.submit()}
          centered
          width={500}
          confirmLoading={submitLoading}
        >
          <Form form={form} onFinish={handleAddEditCategory} layout="vertical">
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name" },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            <Form.Item label="Upload Image">
              <ImgCrop showGrid rotationSlider aspectSlider showReset>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                >
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
};

export default ManageCategory;
