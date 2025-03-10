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
} from "antd";
import CustomizedCard from "../../../molecules/card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { formatMoney } from "../../../../utils/formatMoney";
import { toTitle } from "../../../../utils/formatStr";
import { useParams } from "react-router-dom";
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
  orderItems: ApiOrderItem[];
  shippingAddress?: {
    address: string;
    province: string;
    district: string;
    commune: string;
  };
  paymentMethod?: string;
  shippingMethod?: string;
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
  const { id } = useParams();

  // Modal states
  const [customerModalVisible, setCustomerModalVisible] =
    useState<boolean>(false);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);
  const [orderInfoModalVisible, setOrderInfoModalVisible] =
    useState<boolean>(false);

  // Store consignor information
  const [consignorInfo, setConsignorInfo] = useState<any>(null);
  const [consignorAddress, setConsignorAddress] = useState<any>(null);

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

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse>(`/order/${id}`);

        if (response.data.statusCode === 200) {
          setOrderData(response.data.data);

          // Get consignor info from first order item
          if (
            response.data.data.orderItems &&
            response.data.data.orderItems.length > 0
          ) {
            const firstItem = response.data.data.orderItems[0];
            if (firstItem.product && firstItem.product.consignor) {
              setConsignorInfo(firstItem.product.consignor);

              // Get default address if available
              if (
                firstItem.product.consignor.addresses &&
                firstItem.product.consignor.addresses.length > 0
              ) {
                const defaultAddress =
                  firstItem.product.consignor.addresses.find(
                    (addr) => addr.isDefault
                  );
                setConsignorAddress(
                  defaultAddress || firstItem.product.consignor.addresses[0]
                );
              }
            }
          }

          // Map API order items to OrderDetails format
          const mappedItems = response.data.data.orderItems.map((item) => ({
            id: parseInt(item.id.substring(0, 8), 16),
            productName: item.product.name,
            quantity: 1, // Assuming quantity is always 1 since it's not in the API
            price: item.price,
            imageUrl:
              item.product.imageUrls && item.product.imageUrls.length > 0
                ? item.product.imageUrls[0].image
                : "",
          }));

          setOrderItems(mappedItems);
        } else {
          message.error(
            "Failed to load order details: " + response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const columns: ColumnType<OrderDetails>[] = [
    {
      title: "Product",
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatMoney(price),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const total = record.price * record.quantity;
        return <span>{formatMoney(total)}</span>;
      },
    },
  ];

  const handleMenuClick = (e) => {
    setStatus(e.key);
    // Here you would update the order status with an API call
    console.log("Selected status:", e.key);
  };

  const statusMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="pending">Pending</Menu.Item>
      <Menu.Item key="processing">Processing</Menu.Item>
      <Menu.Item key="completed">Completed</Menu.Item>
      <Menu.Item key="cancelled">Cancelled</Menu.Item>
    </Menu>
  );

  // Function to map API status to display status
  const getDisplayStatus = (apiStatus: string) => {
    switch (apiStatus) {
      case "PENDING_PAYMENT":
        return "Pending Payment";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Processing";
    }
  };

  // Calculate total from order items
  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Modal content components
  const CustomerModalContent = () => (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Name">
        {consignorInfo?.name || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Email">
        {consignorInfo?.email || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Phone">
        {consignorInfo?.phoneNumber || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Username">
        {consignorInfo?.username || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Role">
        {consignorInfo?.role || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Registered On">
        {consignorInfo?.createdAt || "N/A"}
      </Descriptions.Item>
    </Descriptions>
  );

  const AddressModalContent = () => (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Address">
        {consignorAddress?.address || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Commune">
        {consignorAddress?.commune || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="District">
        {consignorAddress?.district || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Province">
        {consignorAddress?.province || "N/A"}
      </Descriptions.Item>
      {consignorAddress?.isDefault && (
        <Descriptions.Item label="Default">Yes</Descriptions.Item>
      )}
    </Descriptions>
  );

  const OrderInfoModalContent = () => (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Order ID">
        {orderData?.id || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Created At">
        {orderData?.createdAt || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        {getDisplayStatus(orderData?.status || "")}
      </Descriptions.Item>
      <Descriptions.Item label="Total Price">
        {formatMoney(orderData?.totalPrice || 0)}
      </Descriptions.Item>
      <Descriptions.Item label="Payment Method">
        {orderData?.paymentMethod || "Credit Card"}
      </Descriptions.Item>
      <Descriptions.Item label="Shipping Method">
        {orderData?.shippingMethod || "Standard Shipping"}
      </Descriptions.Item>
      <Descriptions.Item label="Number of Items">
        {orderData?.orderItems?.length || 0}
      </Descriptions.Item>
    </Descriptions>
  );

  if (loading) {
    return (
      <div className="order-details-loading">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-details-error">
        <p>Order not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="order-details">
      <div className="order-details__info">
        <div className="order-details__info__header">
          <div className="order-details__info__header__id">
            Order ID: #{orderData.id}
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
              <span>Save</span>
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
                title: "Customer",
                value: 0,
                icon: <UserOutlined />,
                details: (
                  <div>
                    {consignorInfo ? (
                      <>
                        <div>
                          <UserOutlined /> {consignorInfo.name || "N/A"}
                        </div>
                        <div>
                          <MailOutlined /> {consignorInfo.email || "N/A"}
                        </div>
                        <div>
                          <PhoneOutlined /> {consignorInfo.phoneNumber || "N/A"}
                        </div>
                      </>
                    ) : (
                      <div>Customer information not available</div>
                    )}
                  </div>
                ),
                onDetail: handleCustomerDetailClick, // Use the named function
              },
              {
                title: "Order Information",
                value: 0,
                icon: <ShoppingOutlined />,
                details: (
                  <div>
                    <div>
                      Shipping:{" "}
                      {orderData.shippingMethod || "Standard Shipping"}
                    </div>
                    <div>
                      Payment: {orderData.paymentMethod || "Credit Card"}
                    </div>
                    <div>Status: {getDisplayStatus(orderData.status)}</div>
                  </div>
                ),
                onDetail: handleOrderInfoDetailClick, // Use the named function
              },
              {
                title: "Shipping Address",
                value: 0,
                icon: <HomeOutlined />,
                details: (
                  <div>
                    {consignorAddress ? (
                      <span>
                        {consignorAddress.address}, {consignorAddress.commune},{" "}
                        {consignorAddress.district}, {consignorAddress.province}
                      </span>
                    ) : (
                      <span>Address information not available</span>
                    )}
                  </div>
                ),
                onDetail: handleAddressDetailClick, // Use the named function
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
                      <button onClick={item.onDetail}>Details</button>
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
              <div>Payment Information</div>
            </div>
            <div className="order-details__info__payment__info__description">
              <div>
                <FontAwesomeIcon icon={faCcMastercard} />
                <span className="order-details__info__payment__info__description__item">
                  Credit Card Payment
                </span>
              </div>
            </div>
          </div>
          <div className="order-details__info__payment__note">
            <div className="order-details__info__payment__note__title">
              <span>Notes</span>
            </div>
            <div className="order-details__info__payment__note__description">
              <span>Additional notes:</span>
            </div>
          </div>
        </div>

        {/* Customer Modal */}
        <Modal
          title="Customer Information"
          open={customerModalVisible} // Change visible to open
          visible={customerModalVisible} // Adding for backward compatibility
          onCancel={() => setCustomerModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setCustomerModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
          zIndex={1050} // Ensure it shows on top
          destroyOnClose={true} // Clean up when closed
        >
          <CustomerModalContent />
        </Modal>

        {/* Address Modal */}
        <Modal
          title="Shipping Address Details"
          open={addressModalVisible} // Change visible to open
          visible={addressModalVisible} // Adding for backward compatibility
          onCancel={() => setAddressModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setAddressModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
          zIndex={1050} // Ensure it shows on top
          destroyOnClose={true} // Clean up when closed
        >
          <AddressModalContent />
        </Modal>

        {/* Order Info Modal */}
        <Modal
          title="Order Information"
          open={orderInfoModalVisible} // Change visible to open
          visible={orderInfoModalVisible} // Adding for backward compatibility
          onCancel={() => setOrderInfoModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setOrderInfoModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
          zIndex={1050} // Ensure it shows on top
          destroyOnClose={true} // Clean up when closed
        >
          <OrderInfoModalContent />
        </Modal>
      </div>

      {/* Product list and bill section */}
      <div className="order-details__list">
        <div className="order-details__list__header">
          <div className="order-details__list__header__left">Product List</div>
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
                Subtotal
              </span>
              <span>{formatMoney(calculateTotal())}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Tax
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Discount
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">
                Shipping Fee
              </span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span
                id="total"
                className="order-details__list__bill__content__item__title"
              >
                Total Amount
              </span>
              <span id="totalValue">{formatMoney(orderData.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
