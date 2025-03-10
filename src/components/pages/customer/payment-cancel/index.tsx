import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CloseCircleFilled,
  HomeOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Result, Typography, Space, Divider } from "antd";
import "./index.scss";

const { Title, Paragraph, Text } = Typography;

const PaymentCancel = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Extract order ID from URL if available
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");

    if (id) {
      setOrderId(id);
    }
  }, [location]);

  return (
    <div className="payment-cancel-container">
      <Result
        status="error"
        icon={<CloseCircleFilled style={{ color: "#ff4d4f" }} />}
        title="Thanh Toán Thất Bại"
        subTitle={
          <div className="cancel-subtitle">
            <Text>
              Rất tiếc, giao dịch thanh toán của quý khách không thành công hoặc
              đã bị hủy.
            </Text>
            {orderId && <Text strong>Mã đơn hàng: {orderId}</Text>}
          </div>
        }
        extra={
          <div className="cancel-details">
            <div className="cancel-reasons">
              <Title level={5}>Có thể do một trong các nguyên nhân sau:</Title>
              <ul>
                <li>Quý khách đã hủy giao dịch</li>
                <li>Thẻ/tài khoản ngân hàng không đủ số dư</li>
                <li>Thông tin thẻ/tài khoản không chính xác</li>
                <li>Lỗi kết nối với cổng thanh toán</li>
              </ul>
            </div>

            <Divider />

            <div className="action-buttons">
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  <Link to="/cart">Thử Thanh Toán Lại</Link>
                </Button>
                <Space
                  size="middle"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <Button size="large" icon={<HomeOutlined />}>
                    <Link to="/">Về Trang Chủ</Link>
                  </Button>
                  <Button size="large" icon={<ShoppingCartOutlined />}>
                    <Link to="/newProduct">Tiếp Tục Mua Sắm</Link>
                  </Button>
                </Space>
              </Space>
            </div>

            <div className="support-info">
              <Paragraph>
                Nếu quý khách cần hỗ trợ, vui lòng liên hệ với bộ phận CSKH
                FODOSHI qua số hotline:
                <Text strong> 1900 1234</Text> hoặc email:{" "}
                <Text strong>cskh@fodoshi.vn</Text>
              </Paragraph>
            </div>

            <div className="fodoshi-signature">
              <Text italic>
                FODOSHI - Thương hiệu thời trang ủy nhiệm số 1 Việt Nam
              </Text>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default PaymentCancel;
