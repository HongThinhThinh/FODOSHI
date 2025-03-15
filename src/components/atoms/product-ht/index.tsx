import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCart } from "../../../services/cartService";
import { message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";

interface ProductCardProps {
  product: any;
  onClick?: () => void;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { mutate } = useCreateCart();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleProductClick = () => {
    navigate(`/product-detail/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (user) {
      // User is logged in, use API
      try {
        mutate(
          { productId: product.id },
          {
            onSuccess: () => {
              message.success("Thêm giỏ hàng thành công");
            },
            onError: (error) => {
              message.error(error?.response?.data);
            },
          }
        );
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      // User is not logged in, use Redux
      try {
        // Add to cart via Redux
        dispatch({
          type: "cart/add",
          payload: {
            id: product.id,
            name: product.name,
            price: product.sellingPrice,
            image: product.mainImage || product.imageUrls?.[0]?.image || "",
            quantity: 1,
            originalPrice: product.originalPrice,
          },
        });
        message.success("Thêm giỏ hàng thành công");
      } catch (error) {
        console.error("Error adding to local cart:", error);
        message.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };

  return (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 w-[280px] h-[400px] group"
      onClick={handleProductClick}
    >
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={product.mainImage || product.imageUrls?.[0]?.image || ""}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.originalPrice > product.sellingPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-10">
            Sale
          </div>
        )}
        <div
          className="absolute bottom-2 right-2 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer z-10"
          onClick={handleAddToCart}
        >
          <ShoppingCartOutlined />
        </div>
      </div>
      <div className="p-4 h-[120px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-1">
            {product.brands?.map((brand) => (
              <span key={brand.id} className="text-xs bg-gray-100 px-1 rounded">
                {brand.name}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-medium mb-1 line-clamp-2">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-500 font-semibold">
              {product.sellingPrice?.toLocaleString("vi-VN")}₫
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="text-gray-400 text-xs line-through ml-1">
                {product.originalPrice?.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {product.gender === "MALE"
              ? "Nam"
              : product.gender === "FEMALE"
              ? "Nữ"
              : "Unisex"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
