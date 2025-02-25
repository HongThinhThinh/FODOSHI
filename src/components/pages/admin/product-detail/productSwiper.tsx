import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { UploadFile } from "antd";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./product.scss"; // Make sure to create this file for custom styles

interface ProductSwiperProps {
  fileList: UploadFile[];
  onImageSelect: (index: number) => void;
  selectedMainImage: number;
}

const ProductSwiper: React.FC<ProductSwiperProps> = ({
  fileList,
  onImageSelect,
  selectedMainImage,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    // Clean up previous object URLs to prevent memory leaks
    const urls: string[] = [];

    fileList.forEach((file) => {
      if (file.originFileObj) {
        const url = URL.createObjectURL(file.originFileObj as File);
        urls.push(url);
      } else if (file.url) {
        // Handle files that already have URLs (like when editing existing products)
        urls.push(file.url);
      }
    });

    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [fileList]);

  return (
    <div className="product-swiper-container w-full h-[370px] rounded mb-6 border border-gray-200 bg-gray-50">
      {imagePreviews.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={10}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          loop={imagePreviews.length > 1}
          className="h-full w-full product-swiper"
        >
          {imagePreviews.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative w-full h-full flex items-center justify-center p-4 cursor-pointer ${
                  index === selectedMainImage ? "ring-4 ring-green-500" : ""
                }`}
                onClick={() => onImageSelect(index)}
              >
                <img
                  src={imageUrl}
                  alt={`preview-${index}`}
                  className="max-w-full max-h-[300px] object-contain"
                />

                {/* Badge hiển thị ảnh chính */}
                {index === selectedMainImage && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                    Ảnh chính
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="empty-state w-full h-full flex flex-col items-center justify-center">
          <div className="text-gray-400 text-6xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Chưa có ảnh</p>
          <p className="text-gray-400 text-sm mt-2">
            Vui lòng tải lên ảnh sản phẩm
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSwiper;
