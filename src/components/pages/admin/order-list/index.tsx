import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Collapse,
  Typography,
  Spin,
  message,
  Card,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  Divider,
  Empty,
  Tooltip,
  Statistic,
} from "antd";
import {
  EyeOutlined,
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  TagOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../../config/api";
import { formatMoney } from "../../../../utils/formatMoney";
import "./index.scss";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Status to tag color mapping
const statusColors = {
  PENDING_PAYMENT: "orange",
  PAID: "green",
  COMPLETED: "blue",
  CANCELLED: "red",
  PROCESSING: "geekblue",
  SHIPPING: "purple",
};

// Status to Vietnamese translation
const statusTranslations = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao hàng",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    status: [],
    dateRange: null,
    priceRange: {
      min: "",
      max: "",
    },
  });
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters whenever orders or filter criteria change
  useEffect(() => {
    if (!orders.length) return;

    applyFilters();
    calculateStats(orders);
  }, [orders, filters, searchText]);

  const calculateStats = (orderData) => {
    const stats = {
      total: orderData.length,
      pending: orderData.filter((order) =>
        ["PENDING_PAYMENT", "PROCESSING", "SHIPPING"].includes(order.status)
      ).length,
      completed: orderData.filter((order) => order.status === "COMPLETED")
        .length,
      cancelled: orderData.filter((order) => order.status === "CANCELLED")
        .length,
    };
    setOrderStats(stats);
  };

  const applyFilters = () => {
    let result = [...orders];

    // Apply search
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(lowerSearchText) ||
          (order.user &&
            order.user.name &&
            order.user.name.toLowerCase().includes(lowerSearchText)) ||
          (order.user &&
            order.user.phoneNumber &&
            order.user.phoneNumber.includes(searchText))
      );
    }

    // Apply status filter
    if (filters.status.length) {
      result = result.filter((order) => filters.status.includes(order.status));
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].startOf("day");
      const endDate = filters.dateRange[1].endOf("day");

      result = result.filter((order) => {
        const orderDate = new Date(
          order.createdAt.split(" ")[0].split("/").reverse().join("-")
        );
        return orderDate >= startDate.toDate() && orderDate <= endDate.toDate();
      });
    }

    // Apply price range filter
    if (filters.priceRange.min !== "" || filters.priceRange.max !== "") {
      result = result.filter((order) => {
        const price = order.totalPrice;
        const min =
          filters.priceRange.min !== ""
            ? parseFloat(filters.priceRange.min)
            : 0;
        const max =
          filters.priceRange.max !== ""
            ? parseFloat(filters.priceRange.max)
            : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredOrders(result);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/order");
      if (response.data && response.data.data) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (values) => {
    setFilters({
      ...filters,
      status: values,
    });
  };

  const handleDateRangeChange = (dates) => {
    setFilters({
      ...filters,
      dateRange: dates,
    });
  };

  const handlePriceRangeChange = (field, value) => {
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: value,
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const resetFilters = () => {
    setSearchText("");
    setFilters({
      status: [],
      dateRange: null,
      priceRange: {
        min: "",
        max: "",
      },
    });
  };

  const viewOrderDetails = (orderId) => {
    if (!orderId) {
      console.error("Cannot navigate to undefined order ID");
      message.error("Không thể xem chi tiết đơn hàng này");
      return;
    }

    console.log("Navigating to order details:", orderId);
    navigate(`/admin/orders/${orderId}`);
  };

  const toggleFilters = () => {
    console.log("Toggling filters from:", showFilters, "to:", !showFilters);
    setShowFilters((prevState) => !prevState);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Text copyable ellipsis style={{ maxWidth: 150 }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => {
        const dateA = new Date(
          a.createdAt.split(" ")[0].split("/").reverse().join("-")
        );
        const dateB = new Date(
          b.createdAt.split(" ")[0].split("/").reverse().join("-")
        );
        return dateA - dateB;
      },
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <span>
          {record.user ? (
            <>
              <div>
                <strong>{record.user.name}</strong>
              </div>
              <div>{record.user.phoneNumber}</div>
            </>
          ) : (
            <span>Khách vãng lai</span>
          )}
        </span>
      ),
      filterSearch: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {statusTranslations[status] || status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => formatMoney(price) + " VND",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewOrderDetails(record.id)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <div className="order-expanded-row">
      <Card title="Sản phẩm trong đơn hàng" bordered={false}>
        {record.orderItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-image">
              {item.product.imageUrls && item.product.imageUrls.length > 0 && (
                <img
                  src={
                    item.product.mainImage || item.product.imageUrls[0].image
                  }
                  alt={item.product.name}
                />
              )}
            </div>
            <div className="order-item-details">
              <div className="order-item-name">{item.product.name}</div>
              <div className="order-item-price">
                {formatMoney(item.price)} VND
              </div>
              <div className="order-item-categories">
                {item.product.categories.map((cat) => (
                  <Tag key={cat.id}>{cat.name}</Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {record.orderHistories && record.orderHistories.length > 0 && (
        <Card
          title="Lịch sử đơn hàng"
          bordered={false}
          style={{ marginTop: 16 }}
        >
          <div className="order-history">
            {record.orderHistories.map((history) => (
              <div key={history.id} className="order-history-item">
                <div className="order-history-date">{history.createdAt}</div>
                <div className="order-history-status">
                  <Tag color={statusColors[history.status] || "default"}>
                    {statusTranslations[history.status] || history.status}
                  </Tag>
                </div>
                {history.note && (
                  <div className="order-history-note">{history.note}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  // Count active filters
  const activeFilterCount =
    (filters.status.length > 0 ? 1 : 0) +
    (filters.dateRange ? 1 : 0) +
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0);

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <Title level={2}>
          <ShoppingOutlined /> Quản lý đơn hàng
        </Title>
        <Space>
          <Tooltip title="Làm mới dữ liệu">
            <Button
              icon={<SyncOutlined />}
              onClick={fetchOrders}
              loading={loading}
            >
              Làm mới
            </Button>
          </Tooltip>
          <Tooltip title={showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}>
            <Button
              type={showFilters ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={toggleFilters}
            >
              Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Statistics Cards */}
      <div className="order-stats">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={orderStats.total}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang xử lý"
                value={orderStats.pending}
                valueStyle={{ color: "#fa8c16" }}
                prefix={<SyncOutlined spin />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={orderStats.completed}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đã hủy"
                value={orderStats.cancelled}
                valueStyle={{ color: "#f5222d" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Search and Filter Section */}
      <div className={`order-filters ${showFilters ? "show" : "hide"}`}>
        <Card className="filter-card">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} lg={8}>
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc số điện thoại"
                value={searchText}
                onChange={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={12} lg={5}>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Lọc theo trạng thái"
                value={filters.status}
                onChange={handleStatusFilterChange}
                allowClear
              >
                {Object.entries(statusTranslations).map(([status, label]) => (
                  <Option key={status} value={status}>
                    <Tag color={statusColors[status]}>{label}</Tag>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["Từ ngày", "Đến ngày"]}
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={12} md={6} lg={2}>
              <Input
                placeholder="Giá từ"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                type="number"
                min="0"
              />
            </Col>
            <Col xs={12} md={6} lg={2}>
              <Input
                placeholder="Giá đến"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                type="number"
                min="0"
              />
            </Col>
            <Col xs={24} md={12} lg={1}>
              <Button
                danger
                type="primary"
                icon={<ClearOutlined />}
                onClick={resetFilters}
                disabled={!activeFilterCount && !searchText}
              >
                Xóa
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Active Filters Display */}
      {(activeFilterCount > 0 || searchText) && (
        <div className="active-filters">
          <div className="active-filters-label">Bộ lọc đang dùng:</div>
          <div className="active-filters-tags">
            {searchText && (
              <Tag closable onClose={() => setSearchText("")}>
                Tìm kiếm: {searchText}
              </Tag>
            )}

            {filters.status.length > 0 && (
              <Tag
                closable
                onClose={() => setFilters({ ...filters, status: [] })}
              >
                Trạng thái:{" "}
                {filters.status.map((s) => statusTranslations[s]).join(", ")}
              </Tag>
            )}

            {filters.dateRange && (
              <Tag
                closable
                onClose={() => setFilters({ ...filters, dateRange: null })}
              >
                Ngày: {filters.dateRange[0].format("DD/MM/YYYY")} -{" "}
                {filters.dateRange[1].format("DD/MM/YYYY")}
              </Tag>
            )}

            {(filters.priceRange.min || filters.priceRange.max) && (
              <Tag
                closable
                onClose={() =>
                  setFilters({ ...filters, priceRange: { min: "", max: "" } })
                }
              >
                Giá: {filters.priceRange.min || "0"} -{" "}
                {filters.priceRange.max || "∞"}
              </Tag>
            )}
          </div>

          <Button type="link" onClick={resetFilters} icon={<ClearOutlined />}>
            Xóa tất cả
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="results-count">
        {filteredOrders.length > 0 ? (
          <Text>
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </Text>
        ) : searchText || activeFilterCount > 0 ? (
          <Text type="secondary">Không tìm thấy đơn hàng phù hợp</Text>
        ) : null}
      </div>

      {/* Order Table */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          className="orders-table"
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              {searchText || activeFilterCount > 0
                ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                : "Chưa có đơn hàng nào"}
            </span>
          }
        />
      )}
    </div>
  );
};

export default OrderList;
