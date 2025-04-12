import React from "react";
import "./index.scss";
import {
  CalendarOutlined,
  DownOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  UserOutlined,
  LoadingOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Menu,
  Row,
  Spin,
  message,
  Modal,
  Descriptions,
  Tag,
  Empty,
  Avatar,
  Card,
} from "antd";
import { formatMoney } from "../../../../utils/formatMoney";
import { toTitle } from "../../../../utils/formatStr";
import { useLocation } from "react-router-dom";
import GenericTable, { ColumnType } from "../../../atoms/table";
import api from "../../../../config/api";
import { useEffect, useState } from "react";

// Define interfaces for API response
interface ApiOrderItem {
  id: string;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    brands: Array<{
      id: number;
      name: string;
      image: string;
      isDeleted: boolean;
    }>;
    categories: Array<{
      id: number;
      name: string;
      image: string;
      isDeleted: boolean;
    }>;
    sellingPrice: number;
    imageUrls: Array<{ id: number; image: string }>;
    mainImage?: string;
    consignor: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      addresses: Array<{
        id: number;
        address: string;
        province: string;
        district: string;
        commune: string;
        isDefault?: boolean;
      }>;
      role: string;
      createdAt: string;
      username: string;
    };
  };
}

interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string | null;
  addresses?: Array<{
    id: number;
    address: string;
    province: string;
    district: string;
    commune: string;
    isDefault?: boolean;
  }>;
  role?: string;
  createdAt?: string;
  username?: string;
  isGuest?: boolean;
}

interface CustomerAddress {
  id?: number;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
}

interface ApiOrder {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    image: string | null;
    addresses: Array<{
      id: number;
      address: string;
      province: string;
      district: string;
      commune: string;
      isDefault?: boolean;
    }>;
    role: string;
    createdAt: string;
    username: string;
  };
  address: {
    id: number;
    address: string;
    province: string;
    district: string;
    commune: string;
    isDeleted: boolean;
    guestName: string | null;
    guestPhone: string | null;
    guestEmail: string | null;
  } | null;
  orderItems: ApiOrderItem[];
  shippingAddress?: {
    address: string;
    province: string;
    district: string;
    commune: string;
  };
  paymentMethod?: string;
  shippingMethod?: string;
  orderHistories?: Array<{
    id: string | number;
    status: string;
    note?: string;
    createdAt: string;
  }>;
}

// Define ProductRecord interface for table
interface ProductRecord {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  brand?: string;
}

export default function OrderDetails() {
  const [status, setStatus] = useState<string>("Thay Đổi Trạng Thái");
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<ApiOrder | null>(null);
  const [orderItems, setOrderItems] = useState<ProductRecord[]>([]);
  const location = useLocation();
  const currentSubPath = location.pathname.split("/")[3];
  const orderId = currentSubPath;

  // Modal states
  const [customerModalVisible, setCustomerModalVisible] =
    useState<boolean>(false);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);
  const [orderInfoModalVisible, setOrderInfoModalVisible] =
    useState<boolean>(false);

  // Store customer information
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [customerAddress, setCustomerAddress] =
    useState<CustomerAddress | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/order/${orderId}`);
      if (response.data && response.data.data) {
        const orderData = response.data.data;
        setOrderData(orderData);

        // Handle the customer info appropriately
        // If guest order, construct customer info from address
        if (!orderData.user && orderData.address) {
          setCustomerInfo({
            name: orderData.address.guestName || "Khách vãng lai",
            email: orderData.address.guestEmail || "Không cung cấp email",
            phoneNumber:
              orderData.address.guestPhone || "Không cung cấp số điện thoại",
            isGuest: true,
          });
        } else {
          setCustomerInfo(orderData.user);
        }

        setCustomerAddress(orderData.address);

        // Transform order items to match OrderItem interface
        const items = orderData.orderItems.map((item: ApiOrderItem) => ({
          id: item.id,
          name: item.product.name,
          price: item.price,
          image:
            item.product.mainImage ||
            (item.product.imageUrls.length > 0
              ? item.product.imageUrls[0].image
              : ""),
          description: item.product.description,
          brand:
            item.product.brands.length > 0 ? item.product.brands[0].name : "",
          category:
            item.product.categories.length > 0
              ? item.product.categories[0].name
              : "",
        }));
        setOrderItems(items);
      }
    } catch (error) {
      message.error("Không thể lấy thông tin chi tiết đơn hàng");
      console.error("Lỗi khi lấy thông tin chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // Implement status update API call here
    message.success(`Trạng thái đơn hàng đã được cập nhật thành ${newStatus}`);
  };

  const handleCustomerDetailClick = () => {
    setCustomerModalVisible(true);
  };

  const handleAddressDetailClick = () => {
    setAddressModalVisible(true);
  };

  const handleOrderInfoDetailClick = () => {
    setOrderInfoModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: React.ReactNode }
    > = {
      PENDING: {
        color: "gold",
        text: "Đang chờ",
        icon: <ClockCircleOutlined />,
      },
      PENDING_PAYMENT: {
        color: "orange",
        text: "Chờ thanh toán",
        icon: <DollarOutlined />,
      },
      PROCESSING: {
        color: "blue",
        text: "Đang xử lý",
        icon: <LoadingOutlined />,
      },
      SHIPPED: { color: "cyan", text: "Đã gửi hàng", icon: <CarOutlined /> },
      PAID: {
        color: "green",
        text: "Đã thanh toán",
        icon: <CheckCircleOutlined />,
      },
      DELIVERED: {
        color: "green",
        text: "Đã giao hàng",
        icon: <ShopOutlined />,
      },
      CANCELED: { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined /> },
    };

    const statusInfo = statusMap[status] || {
      color: "default",
      text: toTitle(status),
      icon: <InfoCircleOutlined />,
    };
    return (
      <Tag color={statusInfo.color}>
        {statusInfo.icon} {statusInfo.text}
      </Tag>
    );
  };

  const columns: ColumnType<ProductRecord>[] = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ProductRecord) => (
        <div className="product-cell">
          {record.image && (
            <img src={record.image} alt={text} className="product-thumbnail" />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatMoney(price),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  const statusMenu = (
    <Menu onClick={({ key }) => handleStatusChange(key as string)}>
      <Menu.Item key="PENDING">
        <ClockCircleOutlined /> Đang chờ
      </Menu.Item>
      <Menu.Item key="PENDING_PAYMENT">
        <DollarOutlined /> Chờ thanh toán
      </Menu.Item>
      <Menu.Item key="PROCESSING">
        <LoadingOutlined /> Đang xử lý
      </Menu.Item>
      <Menu.Item key="PAID">
        <CheckCircleOutlined /> Đã thanh toán
      </Menu.Item>
      <Menu.Item key="SHIPPED">
        <CarOutlined /> Đã gửi hàng
      </Menu.Item>
      <Menu.Item key="DELIVERED">
        <ShopOutlined /> Đã giao hàng
      </Menu.Item>
      <Menu.Item key="CANCELED">
        <CloseCircleOutlined /> Đã hủy
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!orderData) {
    return <Empty description="Không tìm thấy đơn hàng" />;
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>
          <FileTextOutlined /> Đơn hàng #{orderData.id}
        </h1>
        <div className="order-actions">
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            In
          </Button>
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button>
              <TagOutlined /> {status} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            title={
              <div className="card-title">
                <UserOutlined /> Thông tin khách hàng
                <Button type="link" onClick={handleCustomerDetailClick}>
                  <InfoCircleOutlined /> Xem chi tiết
                </Button>
              </div>
            }
          >
            {customerInfo && (
              <div className="customer-info">
                <div className="customer-avatar">
                  <Avatar
                    icon={<UserOutlined />}
                    src={customerInfo.image}
                    size={64}
                  />
                </div>
                <div className="customer-details">
                  <h3>{customerInfo.name}</h3>
                  <p>
                    <MailOutlined /> {customerInfo.email}
                  </p>
                  <p>
                    <PhoneOutlined /> {customerInfo.phoneNumber}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <div className="card-title">
                <HomeOutlined /> Địa chỉ giao hàng
                <Button type="link" onClick={handleAddressDetailClick}>
                  <InfoCircleOutlined /> Xem chi tiết
                </Button>
              </div>
            }
          >
            {customerAddress && (
              <div className="address-info">
                <p>
                  <EnvironmentOutlined /> {customerAddress.address}
                </p>
                <p>
                  {customerAddress.commune}, {customerAddress.district}
                </p>
                <p>{customerAddress.province}</p>
                {customerAddress.guestName && (
                  <div className="guest-info">
                    <p>
                      <b>
                        <UserOutlined /> Người nhận:
                      </b>{" "}
                      {customerAddress.guestName}
                    </p>
                    <p>
                      <PhoneOutlined /> {customerAddress.guestPhone}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <div className="card-title">
                <ShoppingOutlined /> Tổng quan đơn hàng
                <Button type="link" onClick={handleOrderInfoDetailClick}>
                  <InfoCircleOutlined /> Xem chi tiết
                </Button>
              </div>
            }
          >
            <div className="order-summary">
              <p>
                <b>
                  <TagOutlined /> Trạng thái:
                </b>{" "}
                {getStatusTag(orderData.status)}
              </p>
              <p>
                <b>
                  <CalendarOutlined /> Ngày đặt:
                </b>{" "}
                {new Date(orderData.createdAt).toLocaleString()}
              </p>
              <p>
                <b>
                  <CreditCardOutlined /> Phương thức thanh toán:
                </b>{" "}
                Credit Card
              </p>

              <p className="total-price">
                <b>
                  <DollarOutlined /> Tổng cộng:
                </b>{" "}
                {formatMoney(orderData.totalPrice)}
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="order-items-section">
        <Card
          title={
            <>
              <ShoppingOutlined /> Các mặt hàng trong đơn
            </>
          }
        >
          <GenericTable<ProductRecord> columns={columns} data={orderItems} />
        </Card>
      </div>

      {/* Customer Modal */}
      <Modal
        title={
          <>
            <UserOutlined /> Chi tiết khách hàng
          </>
        }
        visible={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCustomerModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {customerInfo && (
          <Descriptions bordered column={1}>
            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Tên
                </>
              }
            >
              {customerInfo.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <MailOutlined /> Email
                </>
              }
            >
              {customerInfo.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <PhoneOutlined /> Số điện thoại
                </>
              }
            >
              {customerInfo.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <TagOutlined /> Loại tài khoản
                </>
              }
            >
              {customerInfo.isGuest ? "Khách vãng lai" : "Đã đăng ký"}
            </Descriptions.Item>
            {customerInfo.createdAt && (
              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> Ngày đăng ký
                  </>
                }
              >
                {new Date(customerInfo.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Address Modal */}
      <Modal
        title={
          <>
            <HomeOutlined /> Chi tiết địa chỉ giao hàng
          </>
        }
        visible={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAddressModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {customerAddress && (
          <Descriptions bordered column={1}>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Địa chỉ
                </>
              }
            >
              {customerAddress.address}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Phường/Xã
                </>
              }
            >
              {customerAddress.commune}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Quận/Huyện
                </>
              }
            >
              {customerAddress.district}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Tỉnh/Thành phố
                </>
              }
            >
              {customerAddress.province}
            </Descriptions.Item>
            {customerAddress.guestName && (
              <>
                <Descriptions.Item
                  label={
                    <>
                      <UserOutlined /> Tên người nhận
                    </>
                  }
                >
                  {customerAddress.guestName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <PhoneOutlined /> Số điện thoại người nhận
                    </>
                  }
                >
                  {customerAddress.guestPhone}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <MailOutlined /> Email người nhận
                    </>
                  }
                >
                  {customerAddress.guestEmail}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Order Info Modal */}
      <Modal
        title={
          <>
            <FileTextOutlined /> Thông tin đơn hàng
          </>
        }
        visible={orderInfoModalVisible}
        onCancel={() => setOrderInfoModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrderInfoModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {orderData && (
          <Descriptions bordered column={1}>
            <Descriptions.Item
              label={
                <>
                  <FileTextOutlined /> Mã đơn hàng
                </>
              }
            >
              {orderData.id}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <CalendarOutlined /> Ngày tạo
                </>
              }
            >
              {new Date(orderData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <TagOutlined /> Trạng thái
                </>
              }
            >
              {getStatusTag(orderData.status)}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  <DollarOutlined /> Tổng
                </>
              }
            >
              {formatMoney(orderData.totalPrice)}
            </Descriptions.Item>
            {orderData.orderHistories &&
              orderData.orderHistories.length > 0 && (
                <Descriptions.Item
                  label={
                    <>
                      <HistoryOutlined /> Lịch sử đơn
                    </>
                  }
                >
                  {orderData.orderHistories.map((history, index) => (
                    <div key={index} className="order-history-item">
                      <p>
                        <b>{getStatusTag(history.status)}</b> -{" "}
                        {new Date(history.createdAt).toLocaleString()}
                      </p>
                      {history.note && (
                        <p className="history-note">{history.note}</p>
                      )}
                    </div>
                  ))}
                </Descriptions.Item>
              )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
