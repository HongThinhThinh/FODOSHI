import React, { useState, useEffect } from "react";
import { Col, Row, message, Drawer, Button } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import InputComponent from "../../atoms/input";
import "./styles.scss";
import api from "../../../config/api";
import ProductCard from "../../atoms/product-ht";
import AOS from "aos";

function NewProductPage() {
  // State for filters
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Fetch initial data
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      if (response.data && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands/active");
      if (response.data && response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/active");
      if (response.data && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Apply filters whenever filter criteria changes
  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter((product) => {
        // Get correct price (sellingPrice or fallback to originalPrice)
        const sellingPrice = product.sellingPrice || product.originalPrice;

        // Price filtering
        let priceMatch = true;

        if (selectedPriceFilter === "below100k") {
          priceMatch = sellingPrice < 100000;
        } else if (selectedPriceFilter === "100k-200k") {
          priceMatch = sellingPrice >= 100000 && sellingPrice <= 200000;
        } else if (selectedPriceFilter === "200k-300k") {
          priceMatch = sellingPrice >= 200000 && sellingPrice <= 300000;
        } else if (selectedPriceFilter === "300k-500k") {
          priceMatch = sellingPrice >= 300000 && sellingPrice <= 500000;
        } else if (selectedPriceFilter === "above500k") {
          priceMatch = sellingPrice > 500000;
        } else {
          // Default case - use price range slider values
          priceMatch =
            sellingPrice >= priceRange[0] && sellingPrice <= priceRange[1];
        }

        // Brand filtering - match against brand names
        const brandMatch =
          selectedBrands.length === 0 ||
          (product.brands &&
            product.brands.some((brand) =>
              selectedBrands.includes(brand.name)
            ));

        // Category filtering - match against category names
        const categoryMatch =
          selectedCategories.length === 0 ||
          (product.categories &&
            product.categories.some((category) =>
              selectedCategories.includes(category.name)
            ));

        // Gender filtering
        const genderMatch =
          selectedGenders.length === 0 ||
          selectedGenders.includes(
            product.gender === "MALE"
              ? "Nam"
              : product.gender === "FEMALE"
              ? "Nữ"
              : "Unisex"
          );

        // Search query filtering in name and description
        const searchMatch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        return (
          priceMatch &&
          brandMatch &&
          categoryMatch &&
          genderMatch &&
          searchMatch
        );
      });

      setFilteredProducts(filtered);
    }
  }, [
    products,
    priceRange,
    selectedBrands,
    selectedCategories,
    selectedGenders,
    searchQuery,
    selectedPriceFilter,
  ]);

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((name) => name !== brandName)
        : [...prev, brandName]
    );
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleGenderToggle = (gender) => {
    setSelectedGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedPriceFilter(null);
    setSearchQuery("");
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Filters component to reuse in both desktop sidebar and mobile drawer
  const FiltersContent = () => (
    <>
      {/* Search */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Tìm kiếm</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="w-full p-2 border rounded-lg pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchOutlined className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bộ lọc</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Đặt lại
        </button>
      </div>

      {/* Price Presets */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Lọc giá</h3>
        <div className="space-y-2">
          {[
            "below100k",
            "100k-200k",
            "200k-300k",
            "300k-500k",
            "above500k",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedPriceFilter(filter)}
              className={`p-2 w-full text-left rounded ${
                selectedPriceFilter === filter ? "bg-blue-200" : "bg-gray-100"
              }`}
            >
              {filter === "below100k"
                ? "Giá dưới 100.000đ"
                : filter === "100k-200k"
                ? "100.000đ - 200.000đ"
                : filter === "200k-300k"
                ? "200.000đ - 300.000đ"
                : filter === "300k-500k"
                ? "300.000đ - 500.000đ"
                : "Giá trên 500.000đ"}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-lg font-medium mb-4">Thương hiệu</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands &&
            brands?.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand?.name)}
                  onChange={() => handleBrandToggle(brand?.name)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span>{brand?.name}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Danh mục</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories &&
            categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category?.name)}
                  onChange={() => handleCategoryToggle(category?.name)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span>{category?.name}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mt-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Giới tính</h3>
        <div className="space-y-2">
          {["Nam", "Nữ", "Unisex"].map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenders.includes(gender)}
                onChange={() => handleGenderToggle(gender)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <section
      className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8"
      data-aos="fade-in"
    >
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter Button */}
        <div
          className="md:hidden flex justify-between items-center mb-4"
          data-aos="fade-down"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
            >
              <FilterOutlined />
              <span>Lọc</span>
            </button>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="border rounded-lg pl-8 pr-2 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchOutlined className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Filters Section - Desktop */}
          <div
            className="hidden md:block w-full md:w-1/4"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
              <FiltersContent />
            </div>
          </div>

          {/* Products Grid */}
          <div
            className="w-full md:w-3/4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {/* Product Count & Sorting - Desktop */}
            <div
              className="hidden md:flex justify-between items-center mb-6"
              data-aos="fade-in"
              data-aos-delay="300"
            >
              <h2 className="text-xl font-semibold">
                {loading
                  ? "Đang tải..."
                  : `Tìm thấy ${filteredProducts.length} sản phẩm`}
              </h2>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  onClick={() => {
                    const sorted = [...filteredProducts].sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                    setFilteredProducts(sorted);
                  }}
                >
                  Mới nhất
                </button>
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  onClick={() => {
                    const sorted = [...filteredProducts].sort(
                      (a, b) => a.sellingPrice - b.sellingPrice
                    );
                    setFilteredProducts(sorted);
                  }}
                >
                  Giá thấp đến cao
                </button>
                <button
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  onClick={() => {
                    const sorted = [...filteredProducts].sort(
                      (a, b) => b.sellingPrice - a.sellingPrice
                    );
                    setFilteredProducts(sorted);
                  }}
                >
                  Giá cao đến thấp
                </button>
              </div>
            </div>

            {/* Sorting - Mobile */}
            <div
              className="flex md:hidden justify-between mb-4 overflow-x-auto pb-2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <button
                className="px-3 py-1 whitespace-nowrap text-xs border rounded hover:bg-gray-100"
                onClick={() => {
                  const sorted = [...filteredProducts].sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  );
                  setFilteredProducts(sorted);
                }}
              >
                Mới nhất
              </button>
              <button
                className="px-3 py-1 whitespace-nowrap text-xs border rounded hover:bg-gray-100"
                onClick={() => {
                  const sorted = [...filteredProducts].sort(
                    (a, b) => a.sellingPrice - b.sellingPrice
                  );
                  setFilteredProducts(sorted);
                }}
              >
                Giá thấp đến cao
              </button>
              <button
                className="px-3 py-1 whitespace-nowrap text-xs border rounded hover:bg-gray-100"
                onClick={() => {
                  const sorted = [...filteredProducts].sort(
                    (a, b) => b.sellingPrice - a.sellingPrice
                  );
                  setFilteredProducts(sorted);
                }}
              >
                Giá cao đến thấp
              </button>
            </div>

            {loading ? (
              <div
                className="flex items-center justify-center h-64"
                data-aos="fade"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className="flex flex-col items-center sm:items-center md:block"
                data-aos="fade-up"
              >
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                  {filteredProducts?.map((product, index) => (
                    <div
                      key={product.id}
                      data-aos="fade-up"
                      data-aos-delay={50 * index}
                      data-aos-anchor-placement="top-bottom"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-lg p-8 text-center"
                data-aos="zoom-in"
              >
                <p className="text-gray-500 mb-4">
                  Không tìm thấy sản phẩm phù hợp
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc sản phẩm"
        placement="left"
        closable={true}
        onClose={() => setShowFilters(false)}
        open={showFilters}
        width={300}
        bodyStyle={{ padding: "16px" }}
        closeIcon={<CloseOutlined />}
        footer={
          <div className="flex justify-between">
            <Button onClick={resetFilters} style={{ flex: 1, marginRight: 8 }}>
              Đặt lại
            </Button>
            <Button
              type="primary"
              onClick={() => setShowFilters(false)}
              style={{ flex: 1 }}
            >
              Xem {filteredProducts.length} sản phẩm
            </Button>
          </div>
        }
      >
        <FiltersContent />
      </Drawer>
    </section>
  );
}

export default NewProductPage;
