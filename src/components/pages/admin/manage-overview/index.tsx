import {
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Spin,
  Typography,
  Divider,
  Space,
  Empty,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  MoreOutlined,
  ShoppingOutlined,
  RiseOutlined,
  TagsOutlined,
  ShopOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./index.scss";
import ButtonComponent from "../../../atoms/button";
import OrderList from "../order-list";
import api from "../../../../config/api";

const { Text } = Typography;

// Chart data point interface
interface ChartDataPoint {
  name: string;
  value: number;
}

// Interface for revenue data response
interface RevenueResponse {
  statusCode: number;
  message: string;
  data: {
    periodType: string;
    revenueData: Record<string, number>;
  };
}

// Add new interfaces
interface ProductSummary {
  totalProducts: number;
  availableProducts: number;
  soldProducts: number;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ProductsSold {
  periodType: string;
  count: number;
  label: string | null;
}

interface DashboardState {
  productSummary: ProductSummary | null;
  productsSold: ProductsSold | null;
  categoriesCount: number;
  brandsCount: number;
  loading: boolean;
}

// Thêm interface này vào phần đầu component
interface RecentlySoldProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  brandName: string;
  soldAt: string;
}

// Constants
const PERIOD_BUTTONS = [
  { key: "DAY", label: "THEO NGÀY" },
  { key: "WEEK", label: "THEO TUẦN" },
  { key: "MONTH", label: "THEO THÁNG" },
  { key: "YEAR", label: "THEO NĂM" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

function Dashboard() {
  const [activeButton, setActiveButton] = useState<string>("DAY");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    productSummary: null,
    productsSold: null,
    categoriesCount: 0,
    brandsCount: 0,
    loading: false,
  });
  // Thêm state mới để lưu doanh thu ngày hiện tại
  const [todayRevenue, setTodayRevenue] = useState<number>(0);
  // Thêm state này vào trong function Dashboard
  const [recentlySoldProducts, setRecentlySoldProducts] = useState<
    RecentlySoldProduct[]
  >([]);

  // Function to fetch revenue data from API
  const fetchRevenueData = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Convert DAY/WEEK/MONTH/YEAR to day/week/month/year for API
      const periodMap: Record<string, string> = {
        DAY: "day",
        WEEK: "week",
        MONTH: "month",
        YEAR: "year",
      };

      const period = periodMap[activeButton];

      console.log(`Fetching revenue data for period: ${period}`);
      if (startDate && endDate) {
        console.log(`Date range: ${startDate} to ${endDate}`);
      }

      // Prepare query parameters
      const params: Record<string, string> = { period };

      // Add date range if provided
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Add timestamp to prevent caching
      params._t = Date.now().toString();

      console.log("API Request params:", params);

      const response = await api.get<RevenueResponse>(
        "/admin/dashboard/revenue",
        {
          params,
        }
      );

      console.log("API Response:", response);

      if (response.data?.data?.revenueData) {
        // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];
        console.log("Today's date:", today);

        // Kiểm tra format của keys trong revenueData
        const revenueDataKeys = Object.keys(response.data.data.revenueData);
        console.log(
          "Revenue data keys format sample:",
          revenueDataKeys.slice(0, 3)
        );

        // Phân tích format ngày từ dữ liệu
        let todayRevenueValue = 0;
        if (revenueDataKeys.length > 0) {
          // Lấy mẫu định dạng ngày từ API trả về
          const sampleKey = revenueDataKeys[0];
          console.log("Sample date format from API:", sampleKey);

          // Các định dạng ngày phổ biến có thể có
          const dateFormats = [
            today, // Format từ ISO - YYYY-MM-DD
            today.replace(/-/g, "/"), // Format YYYY/MM/DD
            new Date().toLocaleDateString("en-CA"), // Format YYYY-MM-DD theo locale
            new Date().toLocaleDateString(), // Format theo locale mặc định (MM/DD/YYYY hoặc DD/MM/YYYY)
          ];

          // Kiểm tra xem định dạng nào khớp với dữ liệu
          for (const format of dateFormats) {
            if (response.data.data.revenueData[format] !== undefined) {
              todayRevenueValue = response.data.data.revenueData[format];
              console.log(
                `Found today's revenue using format: ${format}`,
                todayRevenueValue
              );
              break;
            }
          }

          // Nếu không tìm thấy, hiển thị cảnh báo và sử dụng giá trị 0
          if (todayRevenueValue === 0) {
            console.warn(
              "Could not find today's revenue with any standard format. Check API date format."
            );
            // Thử kiểm tra thêm bằng cách so sánh ngày
            const today = new Date();
            for (const key of revenueDataKeys) {
              // Thử chuyển đổi key thành Date và so sánh
              try {
                const keyDate = new Date(key);
                if (
                  keyDate.getDate() === today.getDate() &&
                  keyDate.getMonth() === today.getMonth() &&
                  keyDate.getFullYear() === today.getFullYear()
                ) {
                  todayRevenueValue = response.data.data.revenueData[key];
                  console.log(
                    `Found today's revenue by date comparison: ${key}`,
                    todayRevenueValue
                  );
                  break;
                }
              } catch (_) {
                // Bỏ qua lỗi nếu không thể chuyển đổi key thành date
              }
            }
          }
        }

        // Cập nhật state doanh thu ngày hiện tại
        setTodayRevenue(todayRevenueValue);

        // Đảm bảo format ngày nhất quán
        // Kiểm tra dữ liệu để xem định dạng ngày trong revenueData
        console.log(
          "Revenue data keys:",
          Object.keys(response.data.data.revenueData).slice(0, 3)
        );

        // Print the data to debug the format
        if (Object.keys(response.data.data.revenueData).length > 0) {
          // Get a sample key from revenueData
          const sampleKey = Object.keys(response.data.data.revenueData)[0];
          console.log("Sample data key format:", sampleKey);

          // Try to find revenue with different date formats
          const formattedToday = new Date().toLocaleDateString("en-CA"); // Gets YYYY-MM-DD format
          const alternativeFormat = today.replace(/-/g, "/");

          console.log("Alternative today formats:", {
            isoFormat: today,
            localeDateString: formattedToday,
            slashFormat: alternativeFormat,
          });

          // Check if any of the formats match
          console.log(
            "Revenue for ISO format:",
            response.data.data.revenueData[today]
          );
          console.log(
            "Revenue for localeDate format:",
            response.data.data.revenueData[formattedToday]
          );
          console.log(
            "Revenue for slash format:",
            response.data.data.revenueData[alternativeFormat]
          );

          // Determine which format works and use it
          if (response.data.data.revenueData[formattedToday] !== undefined) {
            setTodayRevenue(response.data.data.revenueData[formattedToday]);
            console.log(
              "Using localeDate format for today's revenue:",
              formattedToday
            );
          } else if (
            response.data.data.revenueData[alternativeFormat] !== undefined
          ) {
            setTodayRevenue(response.data.data.revenueData[alternativeFormat]);
            console.log(
              "Using slash format for today's revenue:",
              alternativeFormat
            );
          }
        }

        // Convert the revenue data object to array without filtering zero values
        const chartData = Object.entries(response.data.data.revenueData).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        // Only take the last 7 days if there are too many data points
        const lastWeekData = chartData.slice(-7);

        setChartData(lastWeekData);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError(
        "Failed to load revenue data. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm fetchDashboardData
  const fetchDashboardData = async () => {
    setDashboardState((prev) => ({ ...prev, loading: true }));
    try {
      const [productSummaryRes, categoriesRes, brandsRes, productsSoldRes] =
        await Promise.all([
          api.get<ApiResponse<ProductSummary>>(
            "/admin/dashboard/products/summary"
          ),
          api.get<ApiResponse<number>>("/admin/dashboard/categories/count"),
          api.get<ApiResponse<number>>("/admin/dashboard/brands/count"),
          api.get<ApiResponse<ProductsSold>>(
            "/admin/dashboard/products/sold?period=week"
          ),
        ]);

      setDashboardState({
        productSummary: productSummaryRes.data.data,
        productsSold: productsSoldRes.data.data,
        categoriesCount: categoriesRes.data.data,
        brandsCount: brandsRes.data.data,
        loading: false,
      });

      // Gọi API sản phẩm đã bán gần đây
      fetchRecentlySoldProducts();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Thêm hàm này vào trong component Dashboard
  const fetchRecentlySoldProducts = async (limit: number = 10) => {
    try {
      const response = await api.get<ApiResponse<RecentlySoldProduct[]>>(
        "/admin/dashboard/recently-sold",
        {
          params: { limit },
        }
      );

      if (response.data && response.data.data) {
        setRecentlySoldProducts(response.data.data);
        console.log("Recently sold products:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching recently sold products:", error);
    }
  };

  // Fetch data when component mounts or when activeButton changes
  useEffect(() => {
    fetchRevenueData();
    fetchDashboardData();
  }, [activeButton]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get date from X days ago in YYYY-MM-DD format
  const getDateDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  // Handle date range for the different period views
  const handleClickButton = (value: string) => {
    setActiveButton(value);

    // Set appropriate date ranges based on period
    let startDate;
    const endDate = getCurrentDate();

    switch (value) {
      case "DAY":
        startDate = getDateDaysAgo(7);
        break;
      case "WEEK":
        startDate = getDateDaysAgo(30);
        break;
      case "MONTH":
        startDate = getDateDaysAgo(90);
        break;
      case "YEAR":
        startDate = getDateDaysAgo(365);
        break;
      default:
        startDate = undefined;
    }

    fetchRevenueData(startDate, endDate);
  };

  const renderStatCard = (
    title: string,
    value: number | string,
    icon: React.ReactNode,
    color: string,
    suffix?: string
  ) => (
    <Card className="stat-card" bordered={false}>
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        suffix={suffix}
        valueStyle={{ color, fontSize: "18px" }}
      />
      <Progress
        percent={100}
        showInfo={false}
        strokeColor={{ from: "#108ee9", to: "#87d068" }}
        size="small"
      />
    </Card>
  );

  return (
    <div className="dashboard">
      {/* Top Summary Section */}
      <div className="dashboard__summary">
        <div className="summary-card sales-ratio">
          <h4>Tỷ lệ bán hàng</h4>
          <div className="circular-progress">
            <Progress
              type="circle"
              percent={Math.round(
                ((dashboardState.productSummary?.soldProducts || 0) /
                  (dashboardState.productSummary?.totalProducts || 1)) *
                  100
              )}
              format={(percent) => `${percent}%`}
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
            />
          </div>
          <div className="sales-stats">
            <div className="stats-detail">
              <div className="stat-item">
                <span className="label">Đã bán</span>
                <span className="value">
                  {dashboardState.productSummary?.soldProducts || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="label">Còn lại</span>
                <span className="value">
                  {(dashboardState.productSummary?.totalProducts || 0) -
                    (dashboardState.productSummary?.soldProducts || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card performance">
          <h4>Hiệu suất hôm nay</h4>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Statistic
              title="Doanh thu"
              value={todayRevenue}
              formatter={(value) => formatCurrency(value as number)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600", fontSize: "24px" }}
            />
            <Space
              direction="horizontal"
              size="large"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Statistic
                title="Danh mục"
                value={dashboardState.categoriesCount}
                prefix={<TagsOutlined />}
                valueStyle={{ color: "#cf1322", fontSize: "24px" }}
              />
              <Statistic
                title="Thương hiệu"
                value={dashboardState.brandsCount || 0}
                prefix={<ShopOutlined />}
                valueStyle={{ color: "#cf1322", fontSize: "24px" }}
              />
              {/* {renderStatCard(
              "Danh mục",
              dashboardState.categoriesCount,
              <TagsOutlined />,
              "#1890ff"
            )}
            {renderStatCard(
              "Thương hiệu",
              dashboardState.brandsCount,
              <ShopOutlined />,
              "#722ed1"
            )} */}
            </Space>
          </Space>
        </div>

        <div className="summary-card inventory">
          <h4>Thống kê sản phẩm</h4>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Statistic
              title="Tổng sản phẩm"
              value={dashboardState.productSummary?.totalProducts || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#3f8600", fontSize: "20px" }}
            />
            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-header">
                  <span className="label">Sản phẩm có sẵn</span>
                  <span className="value">
                    {dashboardState.productSummary?.availableProducts || 0}
                  </span>
                </div>
                <Progress
                  percent={Math.round(
                    ((dashboardState.productSummary?.availableProducts || 0) /
                      (dashboardState.productSummary?.totalProducts || 1)) *
                      100
                  )}
                  status="success"
                  strokeColor={{
                    from: "#108ee9",
                    to: "#87d068",
                  }}
                />
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span className="label">Sản phẩm đã bán</span>
                  <span className="value">
                    {dashboardState.productSummary?.soldProducts || 0}
                  </span>
                </div>
                <Progress
                  percent={Math.round(
                    ((dashboardState.productSummary?.soldProducts || 0) /
                      (dashboardState.productSummary?.totalProducts || 1)) *
                      100
                  )}
                  status="exception"
                  strokeColor={{
                    from: "#ff4d4f",
                    to: "#ff7875",
                  }}
                />
              </div>
            </div>
          </Space>
        </div>
      </div>

      {/* Chart Section */}
      <div className="dashboard__chart">
        <div className="dashboard__chart__left dashboard__chart__children">
          <div className="dashboard__chart__left__top">
            <div className="dashboard__chart__left__top__left">
              <span>Biểu đồ doanh thu</span>
            </div>
            <div className="dashboard__chart__left__top__right">
              <Space>
                {PERIOD_BUTTONS.map((button) => (
                  <ButtonComponent
                    key={button.key}
                    isActive={activeButton === button.key}
                    onClick={() => handleClickButton(button.key)}
                  >
                    {button.label}
                  </ButtonComponent>
                ))}
              </Space>
            </div>
          </div>
          <div className="dashboard__chart__left__bot">
            {loading ? (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spin size="large" />
              </div>
            ) : error ? (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ff4d4f",
                }}
              >
                {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <CartesianGrid stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(value) => {
                      if (activeButton === "DAY") {
                        return new Date(value).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        });
                      } else if (activeButton === "WEEK") {
                        return `Tuần ${value}`;
                      } else if (activeButton === "MONTH") {
                        return new Date(value).toLocaleDateString("vi-VN", {
                          month: "2-digit",
                          year: "numeric",
                        });
                      } else {
                        return value;
                      }
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `${value.toLocaleString("vi-VN")}đ`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("vi-VN")}đ`,
                      "Doanh thu",
                    ]}
                    labelFormatter={(label) => {
                      if (activeButton === "DAY") {
                        return new Date(label).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        });
                      } else if (activeButton === "WEEK") {
                        return `Tuần ${label}`;
                      } else if (activeButton === "MONTH") {
                        return new Date(label).toLocaleDateString("vi-VN", {
                          month: "2-digit",
                          year: "numeric",
                        });
                      } else {
                        return label;
                      }
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="dashboard__chart__right dashboard__chart__children">
          <Spin spinning={dashboardState.loading}>
            <div className="dashboard__chart__right__top">
              <div className="dashboard__chart__right__top__left">
                <span>Các sản phẩm đã bán gần đây</span>
              </div>
              <div className="dashboard__chart__right__top__right">
                <Button type="text" icon={<MoreOutlined />} />
              </div>
            </div>
            <div className="dashboard__chart__right__summary">
              {recentlySoldProducts.length > 0 ? (
                <div className="recently-sold-list">
                  {recentlySoldProducts.map((product) => (
                    <div key={product.id} className="recently-sold-item">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-brand">{product.brandName}</div>
                        <div className="product-price">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="product-date">
                          {new Date(product.soldAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-products">
                  <Empty description="Chưa có sản phẩm nào được bán gần đây" />
                </div>
              )}
            </div>
          </Spin>
        </div>
      </div>

      {/* Table Section */}
      {/* <div className="dashboard__table">
        <div className="dashboard__table__container">
          <div className="dashboard__table__container__header">
            <div className="dashboard__table__container__header__left">
              <span>Đơn hàng gần đây</span>
            </div>
            <div className="dashboard__table__container__header__right">
              <Button type="text" icon={<MoreOutlined />} />
            </div>
          </div>
          <div className="dashboard__table__container__body">
            <OrderList />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
