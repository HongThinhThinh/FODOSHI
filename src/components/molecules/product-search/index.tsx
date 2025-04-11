import React, { useState, useEffect } from "react";
import { Input, Spin, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    if (initialKeyword) {
      searchProducts(initialKeyword);
    }
  }, [initialKeyword]);

  const searchProducts = async (keyword: string) => {
    if (!keyword.trim()) {
      setProducts([]);
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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tìm kiếm"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    searchProducts(value);
  };

  return (
    <div className="product-search">
      <div className="product-search__input">
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

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

      {!loading && !error && products.length === 0 && searchTerm && (
        <div className="product-search__empty">
          <Empty description="Không tìm thấy sản phẩm nào" />
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-search__results">
          <h3 className="product-search__results-title">
            Kết quả tìm kiếm cho "{searchTerm}" ({products.length} sản phẩm)
          </h3>
          <div className="product-search__grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
