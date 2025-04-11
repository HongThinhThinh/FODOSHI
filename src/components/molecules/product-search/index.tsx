import React, { useState, useEffect } from "react";
import { Input, Spin, Empty, Divider } from "antd";
import {
  SearchOutlined,
  TagOutlined,
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import "./index.scss";
import ProductCard from "../../atoms/product-ht";

const { Search } = Input;

interface Product {
  id: number;
  name: string;
  description: string;
  mainImage: string;
  sellingPrice: number;
  categories: Array<{ id: number; name: string }>;
  status: string;
  gender?: string;
  brands?: Array<{ id: number; name: string }>;
  originalPrice?: number;
}

interface ProductSearchProps {
  initialKeyword?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  initialKeyword = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [popularSearches] = useState([
    "Áo thun",
    "Quần jean",
    "Giày",
    "Túi xách",
    "Đồng hồ",
    "Áo khoác",
  ]);

  useEffect(() => {
    if (initialKeyword) {
      searchProducts(initialKeyword);
    }
  }, [initialKeyword]);

  useEffect(() => {
    if (activeFilter) {
      const filtered = products.filter((product) => {
        if (activeFilter === "male") return product.gender === "MALE";
        if (activeFilter === "female") return product.gender === "FEMALE";
        if (activeFilter === "unisex") return product.gender === "UNISEX";
        if (activeFilter === "sale")
          return (
            product.originalPrice &&
            product.originalPrice > product.sellingPrice
          );
        return true;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [activeFilter, products]);

  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      setProducts([]);
      setFilteredProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://fodoshi.shop/api/products/search?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.");
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tìm kiếm"
      );
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    searchProducts(value);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    searchProducts(term);
  };

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="product-search">
      <div className="product-search__header">
        <h1 className="product-search__title">
          Tìm kiếm <span>thời trang</span> phù hợp với bạn
        </h1>

        <div className="product-search__input">
          <div className="search-wrapper">
            <SearchOutlined className="input-icon" />
            <Search
              placeholder="Tìm sản phẩm..."
              allowClear
              enterButton={false}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="product-search__content">
        {!loading && !error && products.length > 0 && (
          <div className="product-search__filters-container product-search__animate">
            <div className="product-search__filters">
              <span className="filter-title">
                <FilterOutlined /> Lọc kết quả:
              </span>
              <div
                className={`filter-item ${
                  activeFilter === "male" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("male")}
              >
                <ManOutlined />
                Nam
              </div>
              <div
                className={`filter-item ${
                  activeFilter === "female" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("female")}
              >
                <WomanOutlined />
                Nữ
              </div>
              <div
                className={`filter-item ${
                  activeFilter === "unisex" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("unisex")}
              >
                <TeamOutlined />
                Unisex
              </div>
              <div
                className={`filter-item ${
                  activeFilter === "sale" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("sale")}
              >
                <TagOutlined />
                Đang giảm giá
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="product-search__loading">
            <Spin size="large" />
            <p>Đang tìm kiếm sản phẩm...</p>
          </div>
        )}

        {error && (
          <div className="product-search__error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && searchTerm && displayProducts.length === 0 && (
          <div className="product-search__empty product-search__animate">
            <Empty description="Không tìm thấy sản phẩm nào" />
            <Divider />
            <p className="suggestion-title">Gợi ý tìm kiếm phổ biến:</p>
            <div className="suggestions">
              {popularSearches.map((term, index) => (
                <div
                  key={index}
                  className="tag-item"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && displayProducts.length > 0 && (
          <div className="product-search__animate">
            <div className="product-search__results-header">
              <h3 className="product-search__results-title">
                Kết quả tìm kiếm cho "{searchTerm}"
              </h3>
              <p className="product-search__results-count">
                Tìm thấy{" "}
                <span className="highlight">{displayProducts.length}</span> sản
                phẩm
                {activeFilter && (
                  <>
                    {" "}
                    - Lọc theo:{" "}
                    <span className="highlight">
                      {activeFilter === "male"
                        ? "Nam"
                        : activeFilter === "female"
                        ? "Nữ"
                        : activeFilter === "unisex"
                        ? "Unisex"
                        : "Đang giảm giá"}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="product-search__grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
