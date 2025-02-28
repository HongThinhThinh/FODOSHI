import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Slider from "react-slider";
import { useGetProductByCategory } from "../../../../services/productService";
import { useGetBrandActive } from "../../../../services/categoryService";
import { useParams } from "react-router-dom";
import ShowCard from "../../../atoms/show-card";

const ProductCategory = () => {
  const { id } = useParams();
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: products } = useGetProductByCategory(id);
  const { data: brands } = useGetBrandActive(id);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);

  useEffect(() => {
    if (products) {
      const filtered = products.filter((product) => {
        const sellingPrice = product.sellingPrice || product.originalPrice;
        let priceMatch =
          sellingPrice >= priceRange[0] && sellingPrice <= priceRange[1];

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
        }

        const brandMatch =
          selectedBrands.length === 0 ||
          product.brands.some((brand) => selectedBrands.includes(brand.name));

        return priceMatch && brandMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [products, priceRange, selectedBrands, selectedPriceFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
    setSelectedPriceFilter(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
              <div className="mb-4">
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
                        selectedPriceFilter === filter
                          ? "bg-blue-200"
                          : "bg-gray-100"
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
                <div className="space-y-2">
                  {brands &&
                    brands.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => handleBrandToggle(brand.name)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span>{brand.name}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>
          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ShowCard card={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Không có sản phẩm nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
