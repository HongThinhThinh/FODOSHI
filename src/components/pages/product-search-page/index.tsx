import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductSearch from "../../molecules/product-search";
import "./index.scss";

const ProductSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <div className="product-search-page">
      <div className="product-search-page__header">
        {!keyword && (
          <p className="product-search-page__description">
            Tìm kiếm sản phẩm bạn yêu thích từ kho hàng của chúng tôi
          </p>
        )}
      </div>

      <ProductSearch initialKeyword={keyword} />
    </div>
  );
};

export default ProductSearchPage;
