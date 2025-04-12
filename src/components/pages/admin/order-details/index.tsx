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
  const [status, setStatus] = useState<string>("Change Status");
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
      const response = await api.get(`/orders/${orderId}`);
      if (response.data && response.data.data) {
        const orderData = response.data.data;
        setOrderData(orderData);
        setCustomerInfo(orderData.user);
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
      message.error("Failed to fetch order details");
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // Implement status update API call here
    message.success(`Order status updated to ${newStatus}`);
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
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: "gold", text: "Pending" },
      PROCESSING: { color: "blue", text: "Processing" },
      SHIPPED: { color: "cyan", text: "Shipped" },
      DELIVERED: { color: "green", text: "Delivered" },
      CANCELED: { color: "red", text: "Canceled" },
    };

    const statusInfo = statusMap[status] || {
      color: "default",
      text: toTitle(status),
    };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const columns: ColumnType<ProductRecord>[] = [
    {
      title: "Product",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatMoney(price),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  const statusMenu = (
    <Menu onClick={({ key }) => handleStatusChange(key as string)}>
      <Menu.Item key="PENDING">Pending</Menu.Item>
      <Menu.Item key="PROCESSING">Processing</Menu.Item>
      <Menu.Item key="SHIPPED">Shipped</Menu.Item>
      <Menu.Item key="DELIVERED">Delivered</Menu.Item>
      <Menu.Item key="CANCELED">Canceled</Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return <Empty description="Order not found" />;
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Order #{orderData.id}</h1>
        <div className="order-actions">
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print
          </Button>
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button>
              {status} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            title={
              <div className="card-title">
                <UserOutlined /> Customer Information
                <Button type="link" onClick={handleCustomerDetailClick}>
                  View Details
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
                <HomeOutlined /> Shipping Address
                <Button type="link" onClick={handleAddressDetailClick}>
                  View Details
                </Button>
              </div>
            }
          >
            {customerAddress && (
              <div className="address-info">
                <p>{customerAddress.address}</p>
                <p>
                  {customerAddress.commune}, {customerAddress.district}
                </p>
                <p>{customerAddress.province}</p>
                {customerAddress.guestName && (
                  <div className="guest-info">
                    <p>
                      <b>Recipient:</b> {customerAddress.guestName}
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
                <ShoppingOutlined /> Order Summary
                <Button type="link" onClick={handleOrderInfoDetailClick}>
                  View Details
                </Button>
              </div>
            }
          >
            <div className="order-summary">
              <p>
                <b>Status:</b> {getStatusTag(orderData.status)}
              </p>
              <p>
                <b>Date:</b> <CalendarOutlined />{" "}
                {new Date(orderData.createdAt).toLocaleString()}
              </p>
              <p>
                <b>Payment Method:</b> {orderData.paymentMethod || "N/A"}
              </p>
              <p>
                <b>Shipping Method:</b> {orderData.shippingMethod || "N/A"}
              </p>
              <p className="total-price">
                <b>Total:</b> {formatMoney(orderData.totalPrice)}
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="order-items-section">
        <Card title="Order Items">
          <GenericTable<ProductRecord> columns={columns} data={orderItems} />
        </Card>
      </div>

      {/* Customer Modal */}
      <Modal
        title="Customer Details"
        visible={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCustomerModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {customerInfo && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {customerInfo.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {customerInfo.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {customerInfo.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="User Type">
              {customerInfo.isGuest ? "Guest" : "Registered"}
            </Descriptions.Item>
            {customerInfo.createdAt && (
              <Descriptions.Item label="Registered On">
                {new Date(customerInfo.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Address Modal */}
      <Modal
        title="Shipping Address Details"
        visible={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAddressModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {customerAddress && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Address">
              {customerAddress.address}
            </Descriptions.Item>
            <Descriptions.Item label="Commune">
              {customerAddress.commune}
            </Descriptions.Item>
            <Descriptions.Item label="District">
              {customerAddress.district}
            </Descriptions.Item>
            <Descriptions.Item label="Province">
              {customerAddress.province}
            </Descriptions.Item>
            {customerAddress.guestName && (
              <>
                <Descriptions.Item label="Recipient Name">
                  {customerAddress.guestName}
                </Descriptions.Item>
                <Descriptions.Item label="Recipient Phone">
                  {customerAddress.guestPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Recipient Email">
                  {customerAddress.guestEmail}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Order Info Modal */}
      <Modal
        title="Order Information"
        visible={orderInfoModalVisible}
        onCancel={() => setOrderInfoModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrderInfoModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {orderData && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">
              {orderData.id}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {new Date(orderData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusTag(orderData.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {orderData.paymentMethod || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Shipping Method">
              {orderData.shippingMethod || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {formatMoney(orderData.totalPrice)}
            </Descriptions.Item>
            {orderData.orderHistories &&
              orderData.orderHistories.length > 0 && (
                <Descriptions.Item label="Order History">
                  {orderData.orderHistories.map((history, index) => (
                    <div key={index} className="order-history-item">
                      <p>
                        <b>{toTitle(history.status)}</b> -{" "}
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
