import React, { useState, useEffect } from "react";
import "./index.scss";
import {
  CalendarOutlined,
  DownOutlined,
  MoreOutlined,
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
  Table,
  Spin,
  message,
  Modal,
  Descriptions,
  Typography,
  Tag,
  Empty,
} from "antd";
import CustomizedCard from "../../../molecules/card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { formatMoney } from "../../../../utils/formatMoney";
import { toTitle } from "../../../../utils/formatStr";
import { useLocation, useParams } from "react-router-dom";
import GenericTable, { ColumnType } from "../../../atoms/table";
import type { OrderDetails } from "../../../../model/order";
import api from "../../../../config/api";

const { Title, Text } = Typography;

// Define interfaces for API response
interface ApiOrderItem {
  id: string;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    brands: Array<any>;
    categories: Array<any>;
    sellingPrice: number;
    imageUrls: Array<{ id: number; image: string }>;
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
    id: string;
    status: string;
    note?: string;
    createdAt: string;
  }>;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: ApiOrder;
}

export default function OrderDetails() {
  const [status, setStatus] = useState<string>("Change Status");
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<ApiOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderDetails[]>([]);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
  const id = currentSubPath;
  // Modal states
  const [customerModalVisible, setCustomerModalVisible] =
    useState<boolean>(false);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);
  const [orderInfoModalVisible, setOrderInfoModalVisible] =
    useState<boolean>(false);

  // Store customer information
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [customerAddress, setCustomerAddress] = useState<any>(null);

  // Add these debug functions near the top of your component
  const handleCustomerDetailClick = () => {
    console.log("Opening customer modal");
    setCustomerModalVisible(true);
  };

  const handleAddressDetailClick = () => {
    console.log("Opening address modal");
    setAddressModalVisible(true);
  };

  const handleOrderInfoDetailClick = () => {
    console.log("Opening order info modal");
    setOrderInfoModalVisible(true);
  };
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching order details with ID:", id);

      const response = await api.get<ApiResponse>(`/order/${id}`);
      console.log("API Response:", response);

      if (response.data && response.data.statusCode === 200) {
        setOrderData(response.data.data);
        console.log("Order data successfully set:", response.data.data);

        // Process user information
        if (response.data.data.user) {
          setCustomerInfo(response.data.data.user);
          console.log("Customer info set:", response.data.data.user);

          // Get address from user's addresses
          if (
            response.data.data.user.addresses &&
            response.data.data.user.addresses.length > 0
          ) {
            const defaultAddress = response.data.data.user.addresses.find(
              (addr) => addr.isDefault
            );
            setCustomerAddress(
              defaultAddress || response.data.data.user.addresses[0]
            );
            console.log("Customer address set:", customerAddress);
          }
        } else {
          console.log(
            "No user information in order data - possibly a guest order"
          );

          // For guest orders, check for address information in the order.address field
          if (response.data.data.address) {
            // Set the address for display
            setCustomerAddress(response.data.data.address);
            console.log("Guest address found:", response.data.data.address);

            // Create a guest info object from the address data
            if (
              response.data.data.address.guestName ||
              response.data.data.address.guestPhone ||
              response.data.data.address.guestEmail
            ) {
              const guestInfo = {
                name: response.data.data.address.guestName || "Khách vãng lai",
                email: response.data.data.address.guestEmail || "N/A",
                phoneNumber: response.data.data.address.guestPhone || "N/A",
                isGuest: true,
              };

              setCustomerInfo(guestInfo);
              console.log("Created guest info object:", guestInfo);
            }
          } else if (response.data.data.shippingAddress) {
            setCustomerAddress(response.data.data.shippingAddress);
            console.log(
              "Guest shipping address set:",
              response.data.data.shippingAddress
            );
          } else if (response.data.data.orderAddress) {
            setCustomerAddress(response.data.data.orderAddress);
            console.log(
              "Guest order address set:",
              response.data.data.orderAddress
            );
          }
        }

        // Map order items with more error handling
        const mappedItems = response.data.data.orderItems.map((item) => {
          let itemId;
          try {
            itemId = parseInt(item.id.substring(0, 8), 16);
          } catch (e) {
            itemId = Math.floor(Math.random() * 10000); // Fallback ID if parsing fails
          }

          return {
            id: itemId,
            productName: item.product.name,
            quantity: 1,
            price: item.price,
            imageUrl:
              item.product.imageUrls && item.product.imageUrls.length > 0
                ? item.product.imageUrls[0].image
                : "",
          };
        });

        setOrderItems(mappedItems);
        console.log("Order items mapped:", mappedItems);
      } else {
        console.error("API returned non-success response:", response);
        message.error(
          `Failed to load order details: ${
            response?.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details when component mounts
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  // Cập nhật các column của bảng sản phẩm
  const columns: ColumnType<OrderDetails>[] = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (name, record) => (
        <div className="product-cell">
          {record.imageUrl && (
            <img
              src={record.imageUrl}
              alt={name}
              className="product-thumbnail"
              style={{ width: 40, height: 40, marginRight: 10 }}
            />
          )}
          {name}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatMoney(price),
    },
    {
      title: "Tổng tiền",
      key: "total",
      render: (_, record) => {
        const total = record.price * record.quantity;
        return <span>{formatMoney(total)}</span>;
      },
    },
  ];

  // Update the handleMenuClick function to better handle errors
  const handleMenuClick = async (e) => {
    const newStatus = e.key;

    try {
      console.log(`Updating order ${id} status to:`, newStatus);
      setLoading(true);

      const response = await api.patch(`/order/${id}/status`, {
        status: newStatus,
      });

      if (response.data && response.data.statusCode === 200) {
        setStatus(newStatus);
        // Update the order data with the new status
        setOrderData((prev) => (prev ? { ...prev, status: newStatus } : null));

        message.success(
          `Trạng thái đơn hàng đã được cập nhật thành ${getDisplayStatus(
            newStatus
          )}`
        );

        // Refresh the entire order to get updated history
        fetchOrderDetails();
      } else {
        message.error(
          `Không thể cập nhật trạng thái đơn hàng: ${
            response.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);

      // Show the specific error message from the API if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Lỗi: ${error.response.data.message}`);
      } else {
        message.error("Lỗi khi cập nhật trạng thái đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update the status menu with the correct allowed values
  const statusMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="PENDING_PAYMENT">Chờ thanh toán</Menu.Item>
      <Menu.Item key="PAID">Đã thanh toán</Menu.Item>
      <Menu.Item key="PAYMENT_FAILED">Thanh toán thất bại</Menu.Item>
      <Menu.Item key="AWAITING_PICKUP">Chờ lấy hàng</Menu.Item>
      <Menu.Item key="AWAITING_DELIVERY">Đang giao hàng</Menu.Item>
      <Menu.Item key="COMPLETED">Hoàn thành</Menu.Item>
    </Menu>
  );

  // Function to map API status to display status
  const getDisplayStatus = (apiStatus: string) => {
    switch (apiStatus) {
      case "PENDING_PAYMENT":
        return "Chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "PAYMENT_FAILED":
        return "Thanh toán thất bại";
      case "AWAITING_PICKUP":
        return "Chờ lấy hàng";
      case "AWAITING_DELIVERY":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return apiStatus
          ? apiStatus.replace(/_/g, " ").toLowerCase()
          : "Unknown Status";
    }
  };

  // Calculate total from order items
  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Cập nhật OrderInfoModalContent
  const OrderInfoModalContent = () => (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Mã đơn hàng">
        {orderData?.id || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {orderData?.createdAt || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        {getDisplayStatus(orderData?.status || "")}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng tiền">
        {formatMoney(orderData?.totalPrice || 0)}
      </Descriptions.Item>
      <Descriptions.Item label="Phương thức thanh toán">
        {orderData?.paymentMethod || "Thẻ tín dụng"}
      </Descriptions.Item>
      <Descriptions.Item label="Phương thức vận chuyển">
        {orderData?.shippingMethod || "Vận chuyển tiêu chuẩn"}
      </Descriptions.Item>
      <Descriptions.Item label="Số lượng mặt hàng">
        {orderData?.orderItems?.length || 0}
      </Descriptions.Item>
    </Descriptions>
  );

  // Cập nhật CustomerModalContent
  const CustomerModalContent = () => (
    <Descriptions bordered column={1}>
      {customerInfo ? (
        <>
          <Descriptions.Item label="Tên">
            {customerInfo.name}
            {customerInfo.isGuest && (
              <Tag color="orange" style={{ marginLeft: 8 }}>
                Khách vãng lai
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {customerInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {customerInfo.phoneNumber}
          </Descriptions.Item>
          {!customerInfo.isGuest && (
            <>
              <Descriptions.Item label="Tên đăng nhập">
                {customerInfo.username}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {customerInfo.role}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {customerInfo.createdAt}
              </Descriptions.Item>
            </>
          )}
        </>
      ) : (
        <>
          <Descriptions.Item label="Loại khách hàng">
            <strong>Khách vãng lai</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            Đây là đơn hàng của khách vãng lai không có thông tin đăng ký
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );

  // Cập nhật AddressModalContent
  const AddressModalContent = () => (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Địa chỉ">
        {customerAddress?.address || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Phường/Xã">
        {customerAddress?.commune || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Quận/Huyện">
        {customerAddress?.district || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Tỉnh/Thành phố">
        {customerAddress?.province || "N/A"}
      </Descriptions.Item>
      {customerAddress?.isDefault && (
        <Descriptions.Item label="Mặc định">Có</Descriptions.Item>
      )}
      {customerAddress?.guestName && (
        <Descriptions.Item label="Tên khách">
          {customerAddress.guestName}
        </Descriptions.Item>
      )}
      {customerAddress?.guestPhone && (
        <Descriptions.Item label="SĐT khách">
          {customerAddress.guestPhone}
        </Descriptions.Item>
      )}
      {customerAddress?.guestEmail && (
        <Descriptions.Item label="Email khách">
          {customerAddress.guestEmail}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  // Cập nhật nội dung loading và error
  if (loading) {
    return (
      <div className="order-details-loading">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-details-error">
        <p>Không tìm thấy đơn hàng hoặc đã xảy ra lỗi.</p>
      </div>
    );
  }

  // Cập nhật phần giao diện chính
  return (
    <div className="order-details">
      <div className="order-details__info">
        <div className="order-details__info__header">
          <div className="order-details__info__header__id">
            Mã đơn hàng: #{orderData.id}
          </div>
          <div className="order-details__info__header__status">
            <span>{getDisplayStatus(orderData.status)}</span>
          </div>
        </div>
        <div className="order-details__info__sub-header">
          <div className="order-details__info__sub-header__date">
            <CalendarOutlined /> <span>{orderData.createdAt}</span>
          </div>
          <div className="order-details__info__sub-header__tools">
            <Dropdown overlay={statusMenu} trigger={["click"]}>
              <Button className="order-details__info__sub-header__tools__status">
                <span>{toTitle(status)}</span> <DownOutlined />
              </Button>
            </Dropdown>
            <button className="order-details__info__sub-header__tools__print">
              <PrinterOutlined />
            </button>
            <button className="order-details__info__sub-header__tools__save">
              <span>Lưu</span>
            </button>
          </div>
        </div>
        <div className="order-details__info__customer-info">
          <Row
            gutter={[16, 16]}
            justify="space-between"
            className="order-details__info__customer-info__container"
          >
            {[
              {
                title: "Khách hàng",
                value: 0,
                icon: <UserOutlined />,
                details: (
                  <div>
                    {customerInfo ? (
                      <>
                        <div>
                          <UserOutlined /> {customerInfo.name || "N/A"}
                          {customerInfo.isGuest && (
                            <strong> (Khách vãng lai)</strong>
                          )}
                        </div>
                        <div>
                          <MailOutlined /> {customerInfo.email || "N/A"}
                        </div>
                        <div>
                          <PhoneOutlined /> {customerInfo.phoneNumber || "N/A"}
                        </div>
                      </>
                    ) : (
                      <div>
                        <div>
                          <UserOutlined /> <strong>Khách vãng lai</strong>
                        </div>
                        <div>
                          <MailOutlined /> N/A
                        </div>
                        <div>
                          <PhoneOutlined /> N/A
                        </div>
                      </div>
                    )}
                  </div>
                ),
                onDetail: handleCustomerDetailClick,
              },
              {
                title: "Thông tin đơn hàng",
                value: 0,
                icon: <ShoppingOutlined />,
                details: (
                  <div>
                    <div>
                      Vận chuyển:{" "}
                      {orderData.shippingMethod || "Vận chuyển tiêu chuẩn"}
                    </div>
                    <div>
                      Thanh toán: {orderData.paymentMethod || "Thẻ tín dụng"}
                    </div>
                    <div>Trạng thái: {getDisplayStatus(orderData.status)}</div>
                  </div>
                ),
                onDetail: handleOrderInfoDetailClick,
              },
              {
                title: "Địa chỉ giao hàng",
                value: 0,
                icon: <HomeOutlined />,
                details: (
                  <div>
                    {customerAddress ? (
                      <span>
                        {customerAddress.address}, {customerAddress.commune},{" "}
                        {customerAddress.district}, {customerAddress.province}
                      </span>
                    ) : (
                      <span>Không có thông tin địa chỉ</span>
                    )}
                  </div>
                ),
                onDetail: handleAddressDetailClick,
              },
            ].map((item, index) => (
              <Col key={index} flex="1 1 0" style={{ maxWidth: "360px" }}>
                <CustomizedCard
                  styleClass="borderRadius"
                  width={"100%"}
                  height={"200px"}
                  borderRadious={"10px"}
                >
                  <div className="order-details__info__customer-info__container__top">
                    <div className="order-details__info__customer-info__container__top__icon">
                      {item.icon}
                    </div>
                    <div className="order-details__info__customer-info__container__top__details">
                      <div className="order-details__info__customer-info__container__top__details__header">
                        {item.title}
                      </div>
                      <div className="order-details__info__customer-info__container__top__details__description">
                        {item.details}
                      </div>
                    </div>
                  </div>
                  <div className="order-details__info__customer-info__container__bottom">
                    <div className="order-details__info__customer-info__container__bottom__button">
                      <button onClick={item.onDetail}>Chi tiết</button>
                    </div>
                  </div>
                </CustomizedCard>
              </Col>
            ))}
          </Row>
        </div>

        <div className="order-details__info__payment">
          <div className="order-details__info__payment__info">
            <div className="order-details__info__payment__info__title">
              <div>Thông tin thanh toán</div>
            </div>
            <div className="order-details__info__payment__info__description">
              <div>
                <FontAwesomeIcon icon={faCcMastercard} />
                <span className="order-details__info__payment__info__description__item">
                  Thanh toán bằng thẻ tín dụng
                </span>
              </div>
            </div>
          </div>
          <div className="order-details__info__payment__note">
            <div className="order-details__info__payment__note__title">
              <span>Ghi chú</span>
            </div>
            <div className="order-details__info__payment__note__description">
              <span>Ghi chú bổ sung:</span>
            </div>
          </div>
        </div>

        {/* Các Modal */}
        <Modal
          title="Thông tin khách hàng"
          open={customerModalVisible}
          visible={customerModalVisible}
          onCancel={() => setCustomerModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setCustomerModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={600}
          zIndex={1050}
          destroyOnClose={true}
        >
          <CustomerModalContent />
        </Modal>

        <Modal
          title="Chi tiết địa chỉ giao hàng"
          open={addressModalVisible}
          visible={addressModalVisible}
          onCancel={() => setAddressModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setAddressModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={600}
          zIndex={1050}
          destroyOnClose={true}
        >
          <AddressModalContent />
        </Modal>

        <Modal
          title="Thông tin đơn hàng"
          open={orderInfoModalVisible}
          visible={orderInfoModalVisible}
          onCancel={() => setOrderInfoModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setOrderInfoModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={600}
          zIndex={1050}
          destroyOnClose={true}
        >
          <OrderInfoModalContent />
        </Modal>
      </div>

      {/* Danh sách sản phẩm và hóa đơn */}
      <div className="order-details__list">
        <div className="order-details__list__header">
          <div className="order-details__list__header__left">
            Danh sách sản phẩm
          </div>
          <div className="order-details__list__header__right">
            <MoreOutlined />
          </div>
        </div>
        <div className="order-details__list__table">
          <GenericTable data={orderItems} columns={columns} />
        </div>
        <div className="order-details__list__bill">
          <div className="order-details__list__bill__content">
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Tổng giá trị
              </span>
              <span>{formatMoney(calculateTotal())}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Thuế
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Giảm giá
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Phí vận chuyển
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span
                id="total"
                className="order-details__list__bill__content__item__title"
              >
                Tổng thanh toán
              </span>
              <span id="totalValue">{formatMoney(orderData.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử đơn hàng */}
      <div className="order-details__history">
        <div className="order-details__history__header">
          <div className="order-details__history__header__left">
            Lịch sử đơn hàng
          </div>
        </div>
        <div className="order-details__history__content">
          {orderData.orderHistories && orderData.orderHistories.length > 0 ? (
            <div className="order-details__history__timeline">
              {orderData.orderHistories.map((history) => (
                <div
                  key={history.id}
                  className="order-details__history__timeline__item"
                >
                  <div className="order-details__history__timeline__item__date">
                    {history.createdAt}
                  </div>
                  <div className="order-details__history__timeline__item__status">
                    <Tag
                      color={
                        history.status === "PENDING_PAYMENT"
                          ? "orange"
                          : history.status === "COMPLETED"
                          ? "green"
                          : history.status === "CANCELLED"
                          ? "red"
                          : history.status === "PAID"
                          ? "blue"
                          : "default"
                      }
                    >
                      {getDisplayStatus(history.status)}
                    </Tag>
                  </div>
                  {history.note && (
                    <div className="order-details__history__timeline__item__note">
                      Ghi chú: {history.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty description="Chưa có lịch sử đơn hàng" />
          )}
        </div>
      </div>
    </div>
  );
}

// Status to tag color mapping - update with correct values
const statusColors = {
  PENDING_PAYMENT: "orange",
  PAID: "green",
  PAYMENT_FAILED: "red",
  AWAITING_PICKUP: "purple",
  AWAITING_DELIVERY: "blue",
  COMPLETED: "cyan",
};
