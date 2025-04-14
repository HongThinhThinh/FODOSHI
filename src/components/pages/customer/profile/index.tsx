import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Typography,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Skeleton,
  Tabs,
  Badge,
  Empty,
  Tag,
  Radio,
  Upload,
  Spin,
  Result,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  EditOutlined,
  LockOutlined,
  HistoryOutlined,
  PhoneOutlined,
  MailOutlined,
  ShopOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SwapRightOutlined,
  InboxOutlined,
  DownOutlined,
  UpOutlined,
  CarOutlined,
  PlusOutlined,
  ReloadOutlined,
  CloseOutlined,
  EyeOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../../config/api";
import { logout } from "../../../../redux/features/userSlice";
import uploadFile from "../../../../utils/uploadFile";
import getCurrentUser, { UserData } from "../../../../utils/getCurrentUser";
import "./style.scss";
import OrderHistoryPage from "../order-history";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  orderItems: {
    id: string;
    product: {
      id: number;
      name: string;
      mainImage: string;
      brands?: { id: number; name: string }[];
    };
    price: number;
  }[];
}

interface Address {
  id: number;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDeleted: boolean;
  isDefault?: boolean;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("info");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm] = Form.useForm();
  const [addressLoading, setAddressLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const data = await getCurrentUser();
      setUserData(data);
      setUserError(null);
      setImageUrl(data.image || null);
    } catch (error) {
      setUserError(
        error instanceof Error
          ? error
          : new Error("Không thể tải thông tin người dùng")
      );
      console.error("Error fetching user data:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchRecentOrders();
      fetchAddresses();
    }
  }, [userData]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      mirror: false,
      offset: 50,
    });
  }, []);

  const fetchRecentOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/order/account");

      if (response.data.statusCode === 200) {
        const sortedOrders = response.data.data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/address/user");
      if (response.data && Array.isArray(response.data)) {
        const addressData = response.data.map((addr: any) => ({
          ...addr,
          isDefault: addr.isDefault || false,
        }));
        setAddresses(addressData);
      } else if (
        response.data?.statusCode === 200 &&
        Array.isArray(response.data.data)
      ) {
        const addressData = response.data.data.map((addr: any) => ({
          ...addr,
          isDefault: addr.isDefault || false,
        }));
        setAddresses(addressData);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      message.error("Không thể tải địa chỉ giao hàng");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      let imageURL = userData?.image;

      if (imageFile) {
        setImageLoading(true);
        imageURL = await uploadFile(imageFile);
      }

      const updateData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        image: imageURL,
      };

      await api.put("/users", updateData);
      await fetchUserData();

      message.success("Cập nhật thông tin thành công");
      setEditModalVisible(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Không thể cập nhật thông tin");
    } finally {
      setImageLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        return message.error("Mật khẩu xác nhận không khớp với mật khẩu mới");
      }

      await api.put("users/change-password", {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success("Đổi mật khẩu thành công");
      setChangePasswordVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      console.error("Error changing password:", error);

      if (error.response?.status === 400) {
        if (error.response.data && typeof error.response.data === "object") {
          const errorMessages = Object.values(error.response.data).join(", ");
          message.error(
            errorMessages ||
              "Không thể đổi mật khẩu. Vui lòng xem lại mật khẩu cũ"
          );
        } else {
          message.error("Không thể đổi mật khẩu. Vui lòng xem lại mật khẩu cũ");
        }
      } else {
        message.error(
          "Không thể đổi mật khẩu. Hãy kiểm tra lại mật khẩu hiện tại"
        );
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: React.ReactNode }
    > = {
      PENDING_PAYMENT: {
        color: "gold",
        text: "Chờ thanh toán",
        icon: <ClockCircleOutlined />,
      },
      PROCESSING: { color: "blue", text: "Đang xử lý", icon: <ShopOutlined /> },
      SHIPPED: {
        color: "purple",
        text: "Đã gửi hàng",
        icon: <CarOutlined />,
      },
      DELIVERED: {
        color: "green",
        text: "Đã giao hàng",
        icon: <CheckCircleOutlined />,
      },
      CANCELLED: { color: "red", text: "Đã hủy", icon: <CloseOutlined /> },
      COMPLETED: {
        color: "green",
        text: "Hoàn thành",
        icon: <CheckCircleOutlined />,
      },
      PAID: {
        color: "cyan",
        text: "Đã thanh toán",
        icon: <CreditCardOutlined />,
      },
    };

    return (
      statusMap[status] || {
        color: "default",
        text: status,
        icon: <ShoppingOutlined />,
      }
    );
  };

  const showAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);

      addressForm.setFieldsValue({
        address: address.address,
        province: address.province,
        district: address.district,
        commune: address.commune,
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      addressForm.resetFields();
      addressForm.setFieldsValue({
        isDefault: false,
      });
    }

    setAddressModalVisible(true);
  };

  const handleSaveAddress = async (values: any) => {
    setAddressLoading(true);

    try {
      if (editingAddress) {
        await api.put(`/address/user/${editingAddress.id}`, values);
        message.success("Cập nhật địa chỉ thành công");
      } else {
        await api.post("/address/user", values);
        message.success("Thêm địa chỉ mới thành công");
      }

      fetchAddresses();
      setAddressModalVisible(false);
    } catch (error) {
      console.error("Error saving address:", error);
      message.error(
        editingAddress
          ? "Không thể cập nhật địa chỉ"
          : "Không thể thêm địa chỉ mới"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.delete(`/address/user/${id}`);
      message.success("Xóa địa chỉ thành công");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Không thể xóa địa chỉ");
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận file JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleImageChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setImageLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setImageFile(info.file.originFileObj as File);

      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageLoading(false);
        setImageUrl(url);
      });
    }
  };

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const renderEditProfileModal = () => (
    <Modal
      title={
        <span className="font-semibold text-amber-700">
          Chỉnh sửa thông tin cá nhân
        </span>
      }
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      className="profile-edit-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: userData?.name,
          email: userData?.email,
          phoneNumber: userData?.phoneNumber,
        }}
        onFinish={handleUpdateProfile}
      >
        <div className="mb-6 text-center">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader text-center mx-auto"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess && onSuccess("ok");
                }, 0);
              }}
            >
              {imageUrl || userData?.image ? (
                <div className="relative group">
                  <img
                    src={imageUrl || userData?.image}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditOutlined className="text-white text-lg" />
                  </div>
                </div>
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </div>
          <p className="text-gray-500 text-xs">Nhấp vào ảnh để thay đổi</p>
        </div>

        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          hidden={localStorage.getItem("isLoginGoogle") === "true"}
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setEditModalVisible(false)}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={imageLoading}
            className="bg-amber-600 hover:bg-amber-700 border-amber-600"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );

  const renderChangePasswordModal = () => (
    <Modal
      title={<span className="font-semibold text-amber-700">Đổi mật khẩu</span>}
      open={changePasswordVisible}
      onCancel={() => setChangePasswordVisible(false)}
      footer={null}
      className="password-change-modal"
    >
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handleChangePassword}
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu hiện tại"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu mới"
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setChangePasswordVisible(false)}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-amber-600 hover:bg-amber-700 border-amber-600"
          >
            Đổi mật khẩu
          </Button>
        </div>
      </Form>
    </Modal>
  );

  const renderAddressModal = () => (
    <Modal
      title={
        <span className="text-amber-700 font-semibold">
          {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </span>
      }
      open={addressModalVisible}
      onCancel={() => setAddressModalVisible(false)}
      footer={null}
      destroyOnClose
      className="address-modal"
    >
      <Form
        form={addressForm}
        layout="vertical"
        onFinish={handleSaveAddress}
        initialValues={{}}
      >
        <Form.Item
          name="address"
          label="Địa chỉ chi tiết"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
          ]}
        >
          <Input placeholder="Số nhà, tên đường..." />
        </Form.Item>

        <Form.Item
          name="province"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
        >
          <Input placeholder="Nhập tỉnh/thành phố..." />
        </Form.Item>

        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
        >
          <Input placeholder="Nhập quận/huyện..." />
        </Form.Item>

        <Form.Item
          name="commune"
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
        >
          <Input placeholder="Nhập phường/xã..." />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={() => setAddressModalVisible(false)}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={addressLoading}
            className="bg-amber-600 hover:bg-amber-700 border-amber-600"
          >
            {editingAddress ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );

  const renderAddressCard = () => (
    <Card
      title={
        <span className="text-amber-700 flex items-center gap-2">
          <EnvironmentOutlined /> Địa chỉ giao hàng
        </span>
      }
      className="h-full"
    >
      {addresses.length > 0 ? (
        <List
          dataSource={addresses.filter((addr) => !addr.isDeleted).slice(0, 2)}
          renderItem={(address) => (
            <List.Item
              className="py-3"
              actions={[
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => showAddressModal(address)}
                  className="text-blue-600"
                />,
                <Popconfirm
                  title="Xóa địa chỉ"
                  description="Bạn có chắc chắn muốn xóa địa chỉ này?"
                  onConfirm={() => handleDeleteAddress(address.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    className="text-red-600"
                  />
                </Popconfirm>,
              ]}
            >
              <div className="w-full">
                <div>
                  <Text strong>{address.address}</Text>
                </div>
                {address.guestName && (
                  <div className="text-gray-600 text-sm flex items-center mt-1">
                    <UserOutlined className="mr-1" /> {address.guestName}
                  </div>
                )}
                {address.guestPhone && (
                  <div className="text-gray-600 text-sm flex items-center mt-1">
                    <PhoneOutlined className="mr-1" /> {address.guestPhone}
                  </div>
                )}
                <Text type="secondary" className="block mt-1">
                  {address.commune}, {address.district}, {address.province}
                </Text>
              </div>
            </List.Item>
          )}
          footer={
            addresses.length > 2 ? (
              <div className="text-center text-amber-600 pt-2"></div>
            ) : null
          }
        />
      ) : (
        <Empty
          description="Bạn chưa có địa chỉ giao hàng nào"
          className="py-6"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      <div className="mt-4 flex justify-center">
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => showAddressModal()}
          className="border-amber-300 text-amber-700 hover:border-amber-500"
        >
          Thêm địa chỉ mới
        </Button>
      </div>
    </Card>
  );

  if (userLoading) {
    return (
      <div className="profile-page-container font-nunito flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="profile-page-container font-nunito">
        <Result
          status="error"
          title="Không thể tải thông tin tài khoản"
          subTitle="Vui lòng thử lại sau hoặc đăng nhập lại"
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => navigate("/login")}
              className="bg-amber-600 hover:bg-amber-700 border-amber-600"
            >
              Đăng nhập lại
            </Button>,
            <Button key="retry" onClick={fetchUserData}>
              Thử lại
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="profile-page-container font-nunito">
      <div className="profile-banner">
        <div className="profile-banner__container">
          <div
            className="profile__navigation"
            data-aos="fade-down"
            data-aos-duration="600"
          >
            <span className="home-link" onClick={() => navigate("/")}>
              Trang chủ
            </span>
            <span className="separator">{">"}</span>
            <span className="current-page">Thông tin tài khoản</span>
          </div>
          <h1 className="profile__title" data-aos-delay="300">
            Thông tin của bạn...
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="profile-content bg-white rounded-lg shadow-sm">
          <div className="user-summary p-6 flex flex-col md:flex-row justify-between items-center border-b">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={userData?.image}
                className="bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-200"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {userData?.name}
                </h2>
                <p className="text-gray-500 flex items-center gap-1">
                  <MailOutlined /> {userData?.email}
                </p>
                <p className="text-gray-500 flex items-center gap-1">
                  <PhoneOutlined />{" "}
                  {userData?.phoneNumber || "Chưa cập nhật số điện thoại"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditModalVisible(true)}
                className="bg-amber-600 hover:bg-amber-700 border-amber-600"
              >
                Chỉnh sửa hồ sơ
              </Button>
              <Popconfirm
                title="Xác nhận đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
                onConfirm={handleLogout}
                okText="Đăng xuất"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button icon={<LogoutOutlined />} danger>
                  Đăng xuất
                </Button>
              </Popconfirm>
            </div>
          </div>

          <div className="profile-tab-container p-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="profile-tabs"
              tabBarStyle={{ fontWeight: 600, marginBottom: 24 }}
            >
              <TabPane
                tab={
                  <span className="flex items-center gap-1">
                    <UserOutlined /> Thông tin tài khoản
                  </span>
                }
                key="info"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    title={
                      <span className="text-amber-700 flex items-center gap-2">
                        <FileTextOutlined /> Chi tiết tài khoản
                      </span>
                    }
                    className="account-info-card h-full"
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          label: "Họ và tên",
                          value: userData?.name,
                          icon: <UserOutlined className="text-amber-600" />,
                        },
                        {
                          label: "Email",
                          value: userData?.email,
                          icon: <MailOutlined className="text-amber-600" />,
                        },
                        {
                          label: "Số điện thoại",
                          value: userData?.phoneNumber || "Chưa cập nhật",
                          icon: <PhoneOutlined className="text-amber-600" />,
                        },
                        {
                          label: "Vai trò",
                          value:
                            userData?.role === "CONSIGNOR"
                              ? "Khách hàng"
                              : userData?.role,
                          icon: <ShopOutlined className="text-amber-600" />,
                        },
                        {
                          label: "Ngày tham gia",
                          value: userData?.createdAt
                            ? formatDate(userData.createdAt)
                            : "Không có thông tin",
                          icon: <CalendarOutlined className="text-amber-600" />,
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item className="py-3">
                          <div className="flex items-start gap-3 w-full">
                            <div className="mt-1">{item.icon}</div>
                            <div className="flex-grow">
                              <div className="text-gray-500">{item.label}</div>
                              <div className="font-medium">{item.value}</div>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />

                    <Divider />

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-700 font-medium flex items-center gap-1">
                        <LockOutlined /> Bảo mật tài khoản
                      </span>
                      <Button
                        onClick={() => setChangePasswordVisible(true)}
                        icon={<LockOutlined />}
                        className="text-amber-700 border-amber-200 hover:border-amber-400 hover:text-amber-800"
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </Card>

                  {renderAddressCard()}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center gap-1">
                    <HistoryOutlined /> Lịch sử đơn hàng
                  </span>
                }
                key="orders"
              >
                <OrderHistoryPage />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      {renderEditProfileModal()}
      {renderChangePasswordModal()}
      {renderAddressModal()}
    </div>
  );
};

export default ProfilePage;
