import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Button,
  Tooltip,
  message,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import "./styles.scss";

const { Option } = Select;

interface Product {
  id: number;
  name: string;
  description: string;
  mainImage: string;
  originalPrice: number;
  sellingPrice: number;
  status: string;
  gender: string;
  size: string;
  color: string;
  productCondition: string;
  deleted: boolean;
  brands: Array<{ name: string }>;
  categories: Array<{ name: string }>;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    gender: "all",
    priceRange: "all",
    condition: "all",
  });

  useEffect(() => {
    // Fetch products from API
    // For now using mock data
    const mockProducts: Product[] = [
      /* your mock data */
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterProducts(value, filters);
  };

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);

    filterProducts(searchText, newFilters);

    // Show message based on filter type
    if (type === "gender" && value !== "all") {
      message.success(
        `Đang lọc theo ${
          value === "male" ? "Nam" : value === "female" ? "Nữ" : "Unisex"
        }`
      );
    } else if (type === "status" && value !== "all") {
      message.success(
        `Đang lọc theo trạng thái: ${
          value === "available" ? "Đang bán" : "Đã bán"
        }`
      );
    } else if (type === "priceRange" && value !== "all") {
      message.success("Đang lọc theo khoảng giá đã chọn");
    } else if (type === "condition" && value !== "all") {
      message.success("Đang lọc theo tình trạng sản phẩm");
    } else if (value === "all") {
      message.success("Đã hiển thị tất cả sản phẩm");
    }
  };

  const filterProducts = (search: string, currentFilters: typeof filters) => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (currentFilters.status !== "all") {
      filtered = filtered.filter((product) =>
        currentFilters.status === "available"
          ? !product.deleted
          : product.deleted
      );
    }

    // Gender filter
    if (currentFilters.gender !== "all") {
      filtered = filtered.filter((product) => {
        // Ensure case-insensitive comparison
        const productGender = product.gender
          ? product.gender.toUpperCase()
          : "";
        const filterGender = currentFilters.gender.toUpperCase();

        // Only exact matches - strict filtering
        return productGender === filterGender;
      });
    }

    // Price range filter
    if (currentFilters.priceRange !== "all") {
      const [min, max] = currentFilters.priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        if (max) {
          return product.sellingPrice >= min && product.sellingPrice <= max;
        }
        return product.sellingPrice >= min;
      });
    }

    // Condition filter
    if (currentFilters.condition !== "all") {
      filtered = filtered.filter((product) =>
        product.productCondition
          .toLowerCase()
          .includes(currentFilters.condition.toLowerCase())
      );
    }

    setFilteredProducts(filtered);

    // Show a message if no products were found after filtering
    if (filtered.length === 0) {
      message.warning("Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="product-list-container">
      <div className="filters-section">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />

          <Row gutter={16}>
            <Col span={6}>
              <Select
                placeholder="Trạng thái"
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange("status", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="available">Đang bán</Option>
                <Option value="sold">Đã bán</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Giới tính"
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange("gender", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Khoảng giá"
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange("priceRange", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="0-100000">Dưới 100.000đ</Option>
                <Option value="100000-200000">100.000đ - 200.000đ</Option>
                <Option value="200000-500000">200.000đ - 500.000đ</Option>
                <Option value="500000">Trên 500.000đ</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Tình trạng"
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange("condition", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="new">Mới</Option>
                <Option value="like-new">Như mới</Option>
                <Option value="good">Tốt</Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="products-grid">
        {filteredProducts.length === 0 ? (
          <Col span={24}>
            <div className="no-products-message">
              <h3>Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn</h3>
              <p>Vui lòng thử lại với các bộ lọc khác</p>
            </div>
          </Col>
        ) : (
          filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <div className="product-image">
                    <img alt={product.name} src={product.mainImage} />
                    {product.deleted && (
                      <div className="sold-overlay">
                        <span>Đã bán</span>
                      </div>
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <div className="product-info">
                      <div className="price-info">
                        <span className="selling-price">
                          {formatPrice(product.sellingPrice)}
                        </span>
                        <span className="original-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                      <div className="tags">
                        <Tag color="blue">{product.gender}</Tag>
                        <Tag color="green">{product.size}</Tag>
                        <Tag color="purple">{product.productCondition}</Tag>
                      </div>
                      <div className="categories">
                        {product.categories.map((category) => (
                          <Tag key={category.name} color="orange">
                            {category.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProductList;
