import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircleFilled,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Result, Spin, Typography, Space } from "antd";
import api from "../../../../config/api";
import "./index.scss";
import { useSelector } from "react-redux"; // Add this import
import { RootState } from "../../../../redux/store"; // Add this import

const { Title, Paragraph, Text } = Typography;

// Mapping for status translations
const statusTranslations = {
  PAID: "Đã Thanh Toán",
  PENDING_PAYMENT: "Chờ Thanh Toán",
  COMPLETED: "Hoàn Thành",
  CANCELLED: "Đã Hủy",
};

const PaymentSuccess = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const location = useLocation();

  // Get authentication status from Redux
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Extract order ID from URL if available
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");

    if (id) {
      setOrderId(id);
      fetchOrderDetails(id);
      updateOrderStatus(id); // Update order status to PAID
    } else {
      // If no order ID in URL, we're done loading
      setLoading(false);
    }
  }, [location]);

  const fetchOrderDetails = async (id: string) => {
    try {
      let response;

      if (user) {
        // Authenticated user - use regular endpoint
        response = await api.get(`/order/${id}`);
      } else {
        // Guest user - use guess endpoint
        response = await api.get(`/order/guess/${id}`);
      }

      if (response.data && response.data.data) {
        setOrderDetails(response.data.data);
        console.log("Order details loaded:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // message.error(
      //   "Không thể tải thông tin đơn hàng. Vui lòng liên hệ CSKH FODOSHI."
      // );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string) => {
    if (statusUpdated) return; // Prevent duplicate API calls

    try {
      let response;
      console.log(user);
      if (user) {
        // Authenticated user - use regular endpoint
        response = await api.patch(`/order/${id}/status`, {
          status: "PAID",
        });
      } else {
        // Guest user - use guest endpoint
        response = await api.patch(`/order/status/guest/${id}`, {
          status: "PAID",
        });
      }

      console.log("Order status updated:", response.data);
      setStatusUpdated(true);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Don't show error to user as this doesn't affect their experience
    }
  };

  // Format the status in Vietnamese
  const getVietnameseStatus = (status) => {
    return statusTranslations[status] || status;
  };

  return (
    <div className="payment-success-container">
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
          <Paragraph>Đang tải thông tin đơn hàng...</Paragraph>
        </div>
      ) : (
        <Result
          status="success"
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title="Thanh Toán Thành Công"
          subTitle={
            <div className="success-subtitle">
              <Text>
                Cảm ơn quý khách đã tin tưởng FODOSHI! Đơn hàng của quý khách đã
                được thanh toán thành công.
              </Text>
              {orderId && <Text strong>Mã đơn hàng: {orderId}</Text>}
              <div className="track-order-link">
                <Text>
                  Bạn có thể theo dõi đơn hàng tại:{" "}
                  <a
                    target="_blank"
                    href="https://fodoshi.shop/track-order"
                    style={{ color: "#1890ff", fontWeight: "bold" }}
                  >
                    FODOSHI Theo Dõi Đơn Hàng
                  </a>
                </Text>
              </div>
            </div>
          }
          extra={
            <div className="success-details">
              {orderDetails && (
                <div className="order-summary">
                  <Title level={4}>Thông Tin Đơn Hàng</Title>
                  <div className="order-info">
                    <div className="order-detail-row">
                      <Text>Ngày đặt:</Text>
                      <Text strong>{orderDetails.createdAt}</Text>
                    </div>
                    <div className="order-detail-row">
                      <Text>Trạng thái:</Text>
                      <Text strong type="success">
                        {getVietnameseStatus(
                          statusUpdated ? "PAID" : orderDetails.status
                        )}
                      </Text>
                    </div>
                    <div className="order-detail-row">
                      <Text>Tổng tiền:</Text>
                      <Text strong>
                        {orderDetails.totalPrice.toLocaleString("vi-VN")}đ
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <Space size="large">
                  <Button type="primary" size="large" icon={<HomeOutlined />}>
                    <Link to="/">Về Trang Chủ</Link>
                  </Button>
                  <Button size="large" icon={<ShoppingOutlined />}>
                    <Link to="/newProduct">Tiếp Tục Mua Sắm</Link>
                  </Button>
                </Space>
              </div>

              <div className="fodoshi-signature">
                <Text italic>
                  FODOSHI - Thương hiệu thời trang ủy nhiệm số 1 Việt Nam
                </Text>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default PaymentSuccess;
