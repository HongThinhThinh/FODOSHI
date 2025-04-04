import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  TagOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CarOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  EyeOutlined,
  CreditCardOutlined,
  MailOutlined,
  PrinterOutlined,
  DownloadOutlined,
  RightOutlined,
} from "@ant-design/icons";
import api from "../../../config/api";
import {
  Tabs,
  Badge,
  Empty,
  Spin,
  Card,
  Timeline,
  Button,
  Input,
  Select,
  Tag,
  Divider,
  Alert,
  message,
  Modal,
  Steps,
  DatePicker,
  Pagination,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./order-history.scss";

// Giữ nguyên interfaces cũ

const { TabPane } = Tabs;
const { Step } = Steps;
const { Option } = Select;

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // States quản lý modal chi tiết
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalTabKey, setModalTabKey] = useState("1");

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const statusOptions = [
    {
      value: "PENDING_PAYMENT",
      label: "Chờ thanh toán",
      color: "gold",
      icon: <CreditCardOutlined />,
    },
    {
      value: "PROCESSING",
      label: "Đang xử lý",
      color: "blue",
      icon: <InboxOutlined />,
    },
    {
      value: "SHIPPED",
      label: "Đã gửi hàng",
      color: "purple",
      icon: <CarOutlined />,
    },
    {
      value: "DELIVERED",
      label: "Đã giao hàng",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    {
      value: "CANCELLED",
      label: "Đã hủy",
      color: "red",
      icon: <CloseOutlined />,
    },
    {
      value: "COMPLETED",
      label: "Hoàn thành",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    {
      value: "PAID",
      label: "Đã thanh toán",
      color: "cyan",
      icon: <CreditCardOutlined />,
    },
  ];

  // Fetch order history when component mounts
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Update displayed orders when filtered orders or pagination changes
  useEffect(() => {
    updateDisplayedOrders();
  }, [filteredOrders, currentPage]);

  const updateDisplayedOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
  };

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get("/order/account");
      const ordersData = response.data.data || [];

      // Sắp xếp đơn hàng mới nhất lên đầu
      const sortedOrders = ordersData.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
      setCurrentPage(1); // Reset to first page when fetching new data

      if (sortedOrders.length > 0) {
        const maxPrice = Math.max(
          ...sortedOrders.map((order) => order.totalPrice)
        );
        setPriceRange([0, Math.ceil(maxPrice / 10000) * 10000]);
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError("Không thể tải lịch sử đơn hàng");
      message.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on tab and filters
  useEffect(() => {
    if (!orders.length) return;

    let filtered = [...orders];

    // Filter by tab (status)
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    // Filter by custom status filter (if applied)
    if (statusFilter.length > 0) {
      filtered = filtered.filter((order) =>
        statusFilter.includes(order.status)
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      filtered = filtered.filter((order) => {
        const orderDate = dayjs(order.createdAt);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
    }

    // Filter by price range
    filtered = filtered.filter(
      (order) =>
        order.totalPrice >= priceRange[0] && order.totalPrice <= priceRange[1]
    );

    // Filter by search value (order ID or product name)
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.orderItems.some((item) =>
            item.product.name.toLowerCase().includes(searchLower)
          )
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, activeTab, statusFilter, dateRange, priceRange, searchValue]);

  const resetFilters = () => {
    setStatusFilter([]);
    setDateRange(null);
    setPriceRange([0, Math.max(...orders.map((order) => order.totalPrice))]);
    setSearchValue("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusInfo = (status: string) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return (
      statusOption || {
        value: status,
        label: status,
        color: "default",
        icon: <TagOutlined />,
      }
    );
  };

  const getProductImageUrl = (product: Product) => {
    if (product.mainImage && product.mainImage !== "") return product.mainImage;
    if (product.imageUrls && product.imageUrls.length > 0)
      return product.imageUrls[0].image;
    return "https://placehold.co/100x100/e2e8f0/64748b?text=No+Image";
  };

  const getShippingTypeName = (type: string | null) => {
    if (!type) return "Không xác định";
    const shippingMap: Record<string, string> = {
      HOME_DELIVERY: "Giao hàng tận nơi",
      IN_STORE_PICKUP: "Nhận tại cửa hàng",
    };
    return shippingMap[type] || type;
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { title: "Chờ thanh toán", status: "PENDING_PAYMENT" },
      { title: "Đã thanh toán", status: "PAID" },
      { title: "Đang xử lý", status: "PROCESSING" },
      { title: "Đã gửi hàng", status: "SHIPPED" },
      { title: "Đã giao hàng", status: "DELIVERED" },
      { title: "Hoàn thành", status: "COMPLETED" },
    ];

    // Find the current step based on status
    const currentStep = steps.findIndex((step) => step.status === status);
    return { steps, currentStep: currentStep >= 0 ? currentStep : 0 };
  };

  // Xử lý hiển thị modal chi tiết
  const showOrderDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
    setModalTabKey("1");
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render phương thức
  const renderOrderCard = (order: Order) => {
    const statusInfo = getStatusInfo(order.status);

    return (
      <Card
        key={order.id}
        className="order-card mb-4 hover:shadow-md transition-all border border-gray-200 hover:border-amber-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-amber-700" />
            <span className="font-semibold">
              #{order.id.substring(0, 8).toUpperCase()}
            </span>
            <Tag color={statusInfo.color} icon={statusInfo.icon}>
              {statusInfo.label}
            </Tag>
          </div>
          <div className="text-gray-500 text-sm">
            <ClockCircleOutlined className="mr-1" />{" "}
            {formatDate(order.createdAt)}
          </div>
        </div>

        {/* Products */}
        <div className="mb-4">
          <div className="flex flex-col gap-3">
            {order.orderItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={getProductImageUrl(item.product)}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                />
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-800 line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.product.brands?.slice(0, 1).map((brand) => (
                      <span
                        key={brand.id}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                      >
                        {brand.name}
                      </span>
                    ))}
                    {item.product.categories?.slice(0, 1).map((category) => (
                      <span
                        key={category.id}
                        className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-700">
                    {item.price.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>
            ))}

            {order.orderItems.length > 2 && (
              <div className="text-amber-600 text-sm text-center italic">
                +{order.orderItems.length - 2} sản phẩm khác
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-gray-600 text-sm">Tổng tiền:</span>
            <span className="font-bold text-lg ml-2 text-amber-700">
              {order.totalPrice.toLocaleString()} VNĐ
            </span>
          </div>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetailModal(order)}
            className="bg-gradient-to-r from-amber-600 to-amber-700 border-0 hover:from-amber-700 hover:to-amber-800"
          >
            Xem chi tiết
          </Button>
        </div>
      </Card>
    );
  };

  const renderFilterBar = () => (
    <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
      <Input.Search
        placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        allowClear
        className="max-w-md w-full md:w-auto"
      />
      <Button
        icon={<FilterOutlined />}
        onClick={() => setFilterDrawerVisible(true)}
        className={`${
          statusFilter.length > 0 || dateRange?.[0]
            ? "border-amber-400 text-amber-600"
            : ""
        } px-4 py-1.5`}
      >
        Bộ lọc{" "}
        {(statusFilter.length > 0 || dateRange?.[0]) && (
          <Badge
            count={statusFilter.length + (dateRange?.[0] ? 1 : 0)}
            className="ml-1"
          />
        )}
      </Button>
    </div>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    const statusInfo = getStatusInfo(selectedOrder.status);
    const orderItems = selectedOrder.orderItems || [];
    const address = selectedOrder.address;
    const orderHistories = selectedOrder.orderHistories || [];

    return (
      <div className="order-detail-modal font-nunito">
        <Tabs
          activeKey={modalTabKey}
          onChange={setModalTabKey}
          centered
          className="order-detail-tabs"
        >
          <TabPane
            tab={
              <span>
                <ShoppingOutlined /> Thông tin đơn hàng
              </span>
            }
            key="1"
          >
            <div className="order-summary mb-6 bg-gray-50 p-5 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Đơn hàng #{selectedOrder.id.substring(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    <ClockCircleOutlined className="mr-1" /> Đặt lúc:{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col items-end">
                  <Tag
                    color={statusInfo.color}
                    icon={statusInfo.icon}
                    className="mb-1 px-3 py-1 text-sm"
                  >
                    {statusInfo.label}
                  </Tag>
                </div>
              </div>

              {/* Thanh trạng thái đơn hàng */}
              {selectedOrder.status !== "CANCELLED" ? (
                <div className="status-timeline mt-4">
                  <Steps
                    current={getStatusSteps(selectedOrder.status).currentStep}
                    progressDot
                    size="small"
                  >
                    {getStatusSteps(selectedOrder.status).steps.map((step) => (
                      <Step key={step.status} title={step.title} />
                    ))}
                  </Steps>
                </div>
              ) : (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-center mt-3">
                  Đơn hàng đã bị hủy
                </div>
              )}
            </div>

            <Divider orientation="left" className="text-gray-500 text-sm">
              Sản phẩm
            </Divider>

            <div className="order-products space-y-3 mb-6">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-amber-200 transition-colors"
                >
                  <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                    <img
                      src={getProductImageUrl(item.product)}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.product.name}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.product.brands?.map((brand) => (
                        <span
                          key={brand.id}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {brand.name}
                        </span>
                      ))}
                      {item.product.categories?.map((category) => (
                        <span
                          key={category.id}
                          className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="font-bold text-amber-700">
                        {item.price.toLocaleString()} VNĐ
                      </span>
                      <Button
                        type="link"
                        size="small"
                        className="text-amber-600 p-0 border-0"
                        onClick={() =>
                          navigate(`/product-detail/${item.product.id}`)
                        }
                      >
                        Xem sản phẩm
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary bg-gray-50 p-5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tổng tiền sản phẩm:</span>
                <span className="font-medium">
                  {orderItems
                    .reduce((sum, item) => sum + item.price, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {selectedOrder.shippingType === "HOME_DELIVERY"
                    ? "20,000"
                    : "0"}{" "}
                  VNĐ
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">
                  Tổng thanh toán:
                </span>
                <span className="text-xl font-bold text-amber-700">
                  {selectedOrder.totalPrice.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <EnvironmentOutlined /> Thông tin giao hàng
              </span>
            }
            key="2"
          >
            <div className="shipping-info">
              <div className="customer-info mb-6 bg-amber-50 p-5 rounded-lg border border-amber-100">
                <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <UserOutlined className="text-amber-600" /> Thông tin người
                  nhận
                </h3>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <p className="text-gray-800 font-medium">
                      {address.guestName}
                    </p>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <PhoneOutlined /> {address.guestPhone}
                    </p>
                    {address.guestEmail && (
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <MailOutlined /> {address.guestEmail}
                      </p>
                    )}
                  </div>

                  <div className="shipping-method">
                    <Tag
                      color="orange"
                      icon={
                        selectedOrder.shippingType === "HOME_DELIVERY" ? (
                          <CarOutlined />
                        ) : (
                          <ShoppingOutlined />
                        )
                      }
                    >
                      {getShippingTypeName(selectedOrder.shippingType)}
                    </Tag>
                  </div>
                </div>
              </div>

              <div className="address-info bg-green-50 p-5 rounded-lg border border-green-100">
                <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <EnvironmentOutlined className="text-green-600" /> Địa chỉ
                  giao hàng
                </h3>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="mb-1">{address.address}</p>
                  <p className="mb-1">
                    {address.commune}, {address.district}
                  </p>
                  <p>{address.province}</p>
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ClockCircleOutlined /> Lịch sử đơn hàng
              </span>
            }
            key="3"
          >
            {orderHistories.length > 0 ? (
              <Timeline mode="left" className="order-history-timeline">
                {orderHistories.map((history) => {
                  const historyStatus = getStatusInfo(history.status);
                  return (
                    <Timeline.Item
                      key={history.id}
                      color={historyStatus.color}
                      dot={
                        <div className="timeline-dot">{historyStatus.icon}</div>
                      }
                    >
                      <div className="history-item">
                        <div className="history-date text-gray-500 text-sm">
                          {formatDate(history.createdAt)}
                        </div>
                        <div className="history-status">
                          <Tag color={historyStatus.color} className="my-1">
                            {historyStatus.label}
                          </Tag>
                        </div>
                        {history.note && (
                          <div className="history-note bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2 text-sm text-gray-700">
                            {history.note}
                          </div>
                        )}
                      </div>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            ) : (
              <Empty description="Chưa có lịch sử đơn hàng" />
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Lịch sử đơn hàng
        </h1>
        <div className="flex justify-center mt-12">
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-nunito">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Lịch sử đơn hàng
        </h1>
        <p className="text-center text-gray-500">
          Theo dõi và quản lý tất cả đơn hàng của bạn
        </p>
      </div>

      {error && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          action={
            <Button size="small" danger onClick={fetchOrderHistory}>
              Thử lại
            </Button>
          }
        />
      )}

      {!error && orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Empty
            description={
              <div>
                <p className="text-lg font-medium mb-2">
                  Bạn chưa có đơn hàng nào
                </p>
                <p className="text-gray-500">
                  Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay
                </p>
              </div>
            }
          />
          <Button
            type="primary"
            className="mt-4 bg-amber-600 hover:bg-amber-700 border-amber-600"
            onClick={() => navigate("/")}
          >
            Mua sắm ngay
          </Button>
        </div>
      ) : (
        <>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="order-history-tabs"
            tabBarExtraContent={
              <Button
                type="text"
                icon={<ClockCircleOutlined />}
                onClick={() => fetchOrderHistory()}
              >
                Làm mới
              </Button>
            }
          >
            <TabPane
              tab={
                <span>
                  <InboxOutlined /> Tất cả
                  <Badge
                    count={orders.length}
                    className="ml-1"
                    style={{ backgroundColor: "#d99041" }}
                  />
                </span>
              }
              key="all"
            />

            {statusOptions.map((status) => {
              const count = orders.filter(
                (order) => order.status === status.value
              ).length;
              return count > 0 ? (
                <TabPane
                  tab={
                    <span>
                      {status.icon} {status.label}
                      <Badge
                        count={count}
                        className="ml-1"
                        style={{ backgroundColor: "#d99041" }}
                      />
                    </span>
                  }
                  key={status.value}
                />
              ) : null;
            })}
          </Tabs>

          {renderFilterBar()}

          {filteredOrders.length === 0 ? (
            <Empty
              description="Không tìm thấy đơn hàng nào phù hợp với bộ lọc"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <div className="order-cards-container">
                {displayedOrders.map((order) => renderOrderCard(order))}
              </div>

              {/* Pagination */}
              {filteredOrders.length > pageSize && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    total={filteredOrders.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="pagination-amber"
                  />
                </div>
              )}
            </>
          )}

          {/* Modal Chi tiết đơn hàng */}
          <Modal
            title={
              <div className="modal-title">
                <span className="text-lg text-amber-600 font-semibold">
                  Chi tiết đơn hàng
                </span>
              </div>
            }
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
            className="order-detail-modal"
            destroyOnClose={true}
          >
            {renderOrderDetails()}
          </Modal>

          {/* Filter Drawer */}
          <Modal
            title="Lọc đơn hàng"
            open={filterDrawerVisible}
            onCancel={() => setFilterDrawerVisible(false)}
            footer={[
              <Button
                key="reset"
                onClick={resetFilters}
                icon={<CloseOutlined />}
              >
                Xóa bộ lọc
              </Button>,
              <Button
                key="apply"
                type="primary"
                onClick={() => setFilterDrawerVisible(false)}
                className="bg-amber-600 border-amber-600 hover:bg-amber-700 hover:border-amber-700"
              >
                Áp dụng
              </Button>,
            ]}
            width={400}
          >
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="mb-2 font-medium flex items-center">
                  <TagOutlined className="mr-2 text-amber-500" /> Trạng thái đơn
                  hàng
                </h4>
                <Select
                  mode="multiple"
                  placeholder="Chọn trạng thái"
                  style={{ width: "100%" }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  optionLabelProp="label"
                >
                  {statusOptions.map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      <div className="flex items-center">
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <h4 className="mb-2 font-medium flex items-center">
                  <CalendarOutlined className="mr-2 text-amber-500" /> Thời gian
                  đặt hàng
                </h4>
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  value={dateRange as [dayjs.Dayjs | null, dayjs.Dayjs | null]}
                  onChange={(dates) => setDateRange(dates)}
                  placeholder={["Từ ngày", "Đến ngày"]}
                />
              </div>

              <Divider />

              <div>
                <h4 className="font-medium">Bộ lọc đã chọn</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statusFilter.map((status) => {
                    const info = getStatusInfo(status);
                    return (
                      <Tag
                        key={status}
                        closable
                        color={info.color}
                        onClose={() =>
                          setStatusFilter(
                            statusFilter.filter((s) => s !== status)
                          )
                        }
                      >
                        {info.label}
                      </Tag>
                    );
                  })}

                  {dateRange?.[0] && dateRange?.[1] && (
                    <Tag
                      closable
                      color="orange"
                      onClose={() => setDateRange(null)}
                    >
                      {dateRange[0].format("DD/MM/YYYY")} -{" "}
                      {dateRange[1].format("DD/MM/YYYY")}
                    </Tag>
                  )}

                  {statusFilter.length === 0 && !dateRange?.[0] && (
                    <div className="text-gray-500 text-sm italic">
                      Chưa có bộ lọc nào được áp dụng
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
