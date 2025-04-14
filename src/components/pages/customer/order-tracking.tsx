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
  RightOutlined,
} from "@ant-design/icons";
import api from "../../../config/api";
import { DatePicker, Select, Slider, Tag, Empty, Spin, Collapse } from "antd";
import dayjs from "dayjs";

// Interfaces remain the same
interface OrderHistoryItem {
  id: number;
  status: string;
  image: string | null;
  note: string | null;
  createdAt: string;
}

interface Address {
  id: number;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDeleted: boolean;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
}

interface Brand {
  id: number;
  name: string;
  image: string;
  isDeleted: boolean;
}

interface Category {
  id: number;
  name: string;
  image: string;
  isDeleted: boolean;
}

interface Tag {
  id: number;
  tagName: string;
}

interface ProductHistory {
  id: number;
  status: string;
  createdAt: string;
}

interface Consignor {
  id: string;
  image: string | null;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  enabled: boolean;
  username: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brands: Brand[];
  categories: Category[];
  productCondition: string;
  size: string;
  color: string;
  imageUrls: { id: number; image: string }[];
  mainImage: string;
  tags: Tag[];
  originalPrice: number;
  sellingPrice: number;
  status: string;
  gender: string;
  productHistories: ProductHistory[];
  consignor: Consignor;
  createdAt: string;
  deleted: boolean;
}

interface OrderItem {
  id: string;
  price: number;
  product: Product;
}

interface User {
  id: string;
  image: string | null;
  name: string;
  email: string;
  phoneNumber: string;
  addresses: Address[];
  role: string;
  createdAt: string;
  enabled: boolean;
  username: string;
}

interface Order {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  user: User;
  address: Address;
  orderItems: OrderItem[];
  orderHistories: OrderHistoryItem[];
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Order | Order[];
}

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

const OrderTrackingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const statusOptions = [
    { value: "PENDING_PAYMENT", label: "Chờ thanh toán" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đã gửi hàng" },
    { value: "DELIVERED", label: "Đã giao hàng" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "SOLD", label: "Đã bán" },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email");
      return;
    }

    setLoading(true);
    setError("");
    setStatusFilter([]);
    setDateRange(null);
    setPriceRange([0, 1000000]);

    try {
      // const response = await api.get<ApiResponse>(
      //   `/order/guess/${encodeURIComponent(searchTerm)}`
      // );
      const response = await api.get<ApiResponse>(
        `/order/phone-email?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      console.log("API Response:", response.data);

      // Handle different response formats
      let ordersData: Order[] = [];

      if (response.data && response.data.data) {
        // Check if data is an array or a single object
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (typeof response.data.data === "object") {
          // If data is a single order object, wrap it in an array
          ordersData = [response.data.data];
        }
      }

      // Sort orders by createdAt date (newest first)
      ordersData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      console.log("Orders data:", ordersData);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setHasSearched(true);

      // If we have orders, set appropriate max price for slider
      if (ordersData.length > 0) {
        const maxPrice = Math.max(
          ...ordersData.map((order) => order.totalPrice)
        );
        setPriceRange([0, Math.ceil(maxPrice / 10000) * 10000]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Có lỗi xảy ra khi tìm kiếm đơn hàng");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when filter criteria change
  useEffect(() => {
    if (!orders.length || !hasSearched) return;

    console.log("Filtering orders:", orders);
    console.log("Status filter:", statusFilter);
    console.log("Date range:", dateRange);
    console.log("Price range:", priceRange);

    let filtered = [...orders];

    // Filter by status
    if (statusFilter.length > 0) {
      filtered = filtered.filter((order) =>
        statusFilter.includes(order.status)
      );
      console.log("After status filter:", filtered);
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");

      filtered = filtered.filter((order) => {
        const orderDate = dayjs(order.createdAt);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
      console.log("After date filter:", filtered);
    }

    // Filter by price range
    filtered = filtered.filter(
      (order) =>
        order.totalPrice >= priceRange[0] && order.totalPrice <= priceRange[1]
    );
    console.log("After price filter:", filtered);

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateRange, priceRange, hasSearched]);

  const resetFilters = () => {
    setStatusFilter([]);
    setDateRange(null);
    setPriceRange([0, Math.max(...orders.map((order) => order.totalPrice))]);
    setFilteredOrders(orders);
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

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING_PAYMENT: "Chờ thanh toán",
      PROCESSING: "Đang xử lý",
      SHIPPED: "Đã gửi hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
      COMPLETED: "Hoàn thành",
      PAID: "Đã thanh toán",
      SOLD: "Đã bán",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColorMap: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-green-100 text-green-800",
      PAID: "bg-emerald-100 text-emerald-800",
      SOLD: "bg-teal-100 text-teal-800",
    };
    return statusColorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getProductImageUrl = (product: Product) => {
    if (product.mainImage && product.mainImage !== "") return product.mainImage;
    if (product.imageUrls && product.imageUrls.length > 0)
      return product.imageUrls[0].image;
    return "https://placehold.co/100x100/e2e8f0/64748b?text=No+Image";
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Tra Cứu Đơn Hàng
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nhập số điện thoại hoặc email để tra cứu thông tin tất cả đơn hàng của
          bạn
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập số điện thoại hoặc email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spin size="small" />
                <span>Đang tìm...</span>
              </>
            ) : (
              <>
                <SearchOutlined />
                <span>Tìm Kiếm</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <CloseOutlined className="text-red-500" />
            {error}
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700 font-medium">
              {filteredOrders.length > 0 ? (
                <>Tìm thấy {filteredOrders.length} đơn hàng</>
              ) : (
                <>Không tìm thấy đơn hàng nào</>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                showFilters
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "text-gray-600 border-gray-300"
              }`}
            >
              <FilterOutlined /> Lọc đơn hàng
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-5 rounded-lg shadow-md mb-6 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
                    <TagOutlined /> Trạng thái đơn hàng
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Chọn trạng thái"
                    className="w-full"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    optionFilterProp="label"
                  >
                    {statusOptions.map((option) => (
                      <Option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      >
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
                    <CalendarOutlined /> Thời gian đặt hàng
                  </label>
                  <RangePicker
                    className="w-full"
                    format="DD/MM/YYYY"
                    value={
                      dateRange as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                    }
                    onChange={(dates) => setDateRange(dates)}
                    placeholder={["Từ ngày", "Đến ngày"]}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
                    <DollarOutlined /> Khoảng giá (VNĐ)
                  </label>
                  <Slider
                    range
                    min={0}
                    max={priceRange[1]}
                    value={[priceRange[0], priceRange[1]]}
                    onChange={(values) => {
                      if (Array.isArray(values) && values.length === 2) {
                        setPriceRange([values[0], values[1]]);
                      }
                    }}
                    step={10000}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{priceRange[0].toLocaleString()} VNĐ</span>
                    <span>{priceRange[1].toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <CloseOutlined /> Xóa bộ lọc
                </button>
              </div>

              {/* Active Filters */}
              {(statusFilter.length > 0 ||
                dateRange?.[0] ||
                priceRange[0] > 0 ||
                priceRange[1] <
                  Math.max(...orders.map((order) => order.totalPrice))) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {statusFilter.map((status) => (
                    <Tag
                      key={status}
                      closable
                      onClose={() =>
                        setStatusFilter(
                          statusFilter.filter((s) => s !== status)
                        )
                      }
                      className="px-2 py-1"
                    >
                      Trạng thái: {getStatusName(status)}
                    </Tag>
                  ))}

                  {dateRange?.[0] && dateRange?.[1] && (
                    <Tag
                      closable
                      onClose={() => setDateRange(null)}
                      className="px-2 py-1"
                    >
                      Thời gian: {dateRange[0].format("DD/MM/YYYY")} -{" "}
                      {dateRange[1].format("DD/MM/YYYY")}
                    </Tag>
                  )}

                  <Tag
                    closable
                    onClose={() =>
                      setPriceRange([
                        0,
                        Math.max(...orders.map((order) => order.totalPrice)),
                      ])
                    }
                    className="px-2 py-1"
                  >
                    Giá: {priceRange[0].toLocaleString()} -{" "}
                    {priceRange[1].toLocaleString()} VNĐ
                  </Tag>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <Empty
                description={
                  <span className="text-gray-500">
                    {hasSearched
                      ? "Không tìm thấy đơn hàng phù hợp với điều kiện tìm kiếm"
                      : "Vui lòng nhập số điện thoại hoặc email để tìm kiếm đơn hàng"}
                  </span>
                }
              />
            </div>
          ) : (
            <div className="space-y-6">
              {(() => {
                console.log("Rendering orders:", filteredOrders);
                return null;
              })()}
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Đơn hàng #{order.id.substring(0, 8).toUpperCase()}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusName(order.status)}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1 mb-1 md:mb-0">
                          <ClockCircleOutlined /> Ngày đặt:{" "}
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Tổng đơn hàng
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {order.totalPrice.toLocaleString()} VNĐ
                      </p>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Shipping Info */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <EnvironmentOutlined className="text-blue-500" /> Thông
                        tin giao hàng
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2">
                          <div className="flex items-start gap-2">
                            <UserOutlined className="mt-1 text-gray-500" />
                            <div>
                              {order.user ? (
                                <>
                                  <p className="font-medium">
                                    {order.user.name}
                                  </p>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    <PhoneOutlined /> {order.user.phoneNumber}
                                  </p>
                                  {order.user.email && (
                                    <p className="text-gray-600">
                                      {order.user.email}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">
                                    {order.address.guestName}
                                  </p>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    <PhoneOutlined /> {order.address.guestPhone}
                                  </p>
                                  {order.address.guestEmail && (
                                    <p className="text-gray-600">
                                      {order.address.guestEmail}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-gray-700 flex items-start gap-2">
                          <EnvironmentOutlined className="mt-1 text-gray-500" />
                          <div>
                            <p>{order.address.address}</p>
                            <p>
                              {order.address.commune}, {order.address.district}
                            </p>
                            <p>{order.address.province}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-3">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <ShoppingOutlined className="text-blue-500" /> Sản phẩm
                        ({order.orderItems.length})
                      </h4>

                      <div className="space-y-4">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                              <img
                                src={getProductImageUrl(item.product)}
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800">
                                {item.product.name}
                              </h5>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {item.product.brands.map((brand) => (
                                  <span
                                    key={brand.id}
                                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {brand.name}
                                  </span>
                                ))}
                                {item.product.categories.map((category) => (
                                  <span
                                    key={category.id}
                                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                                <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                                  {item.product.size}
                                </span>
                                <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                  {item.product.gender}
                                </span>
                              </div>
                              <p className="mt-2 font-bold text-blue-600">
                                {item.price.toLocaleString()} VNĐ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {order.orderHistories && order.orderHistories.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <Collapse
                        ghost
                        className="bg-gray-50 rounded-lg"
                        expandIcon={({ isActive }) => (
                          <RightOutlined rotate={isActive ? 90 : 0} />
                        )}
                      >
                        <Panel
                          header={
                            <h4 className="font-medium text-gray-800 flex items-center gap-2">
                              <ClockCircleOutlined className="text-blue-500" />{" "}
                              Lịch sử đơn hàng
                            </h4>
                          }
                          key="1"
                        >
                          <div className="pl-4 border-l-2 border-blue-400 ml-4 space-y-4">
                            {order.orderHistories.map((history) => (
                              <div
                                key={history.id}
                                className="relative pb-4 flex items-start gap-3"
                              >
                                <div className="absolute left-[-1.65rem] top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-500">
                                    {formatDate(history.createdAt)}
                                  </div>
                                  <div className="font-medium mt-1">
                                    <span
                                      className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                                        history.status
                                      )}`}
                                    >
                                      {getStatusName(history.status)}
                                    </span>
                                  </div>
                                  {history.note && (
                                    <div className="mt-1 text-sm text-gray-600">
                                      {history.note}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
