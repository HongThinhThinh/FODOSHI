import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Slider from "react-slider";
import { useGetProductByCategory } from "../../../../services/productService";
import { useParams } from "react-router-dom";

const ProductCategory = () => {
  const { id } = useParams();
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: products } = useGetProductByCategory(id);

  useEffect(() => {
    if (products) {
      const filtered = products.filter((product) => {
        const sellingPrice = product.sellingPrice || product.originalPrice;
        const priceMatch =
          sellingPrice >= priceRange[0] && sellingPrice <= priceRange[1];
        const brandMatch =
          selectedBrands.length === 0 ||
          product.brands.some((brand) => selectedBrands.includes(brand.name));
        return priceMatch && brandMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [products, priceRange, selectedBrands]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedBrands([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </button>
              </div>
              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <Slider
                  className="w-full h-2 bg-gray-200 rounded-md"
                  thumbClassName="w-4 h-4 bg-blue-600 rounded-full"
                  trackClassName="h-2 bg-blue-600 rounded-md"
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={1000000}
                />
                <div className="flex justify-between mt-2">
                  <span>{priceRange[0]} VND</span>
                  <span>{priceRange[1]} VND</span>
                </div>
              </div>
              {/* Brand Filter */}
              <div>
                <h3 className="text-lg font-medium mb-4">Brands</h3>
                <div className="space-y-2">
                  {products &&
                    [
                      ...new Set(
                        products.flatMap((p) => p.brands.map((b) => b.name))
                      ),
                    ].map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>
          {/* Products Grid */}
          <div className="cursor-pointer w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105"
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {product.brands.map((b) => b.name).join(", ")}
                    </p>
                    <p className="text-blue-600 font-bold">
                      {product.sellingPrice.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
