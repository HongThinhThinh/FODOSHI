import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../../../atoms/carousel";
import { Navigation } from "swiper/modules";
import { showCardModel } from "../../../../assets/model";
import ShowCard from "../../../atoms/show-card";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./styles.scss";
import { FaCaretLeft } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FaCaretRight } from "react-icons/fa";
import { formatMoney } from "../../../../utils/formatMoney";
import ButtonComponent from "../../../atoms/button";
import { useGetProductAvailable, useGetProductDetail } from "../../../../services/productService";
import { ColorPicker } from "antd";
type Product = {
  id: number;
  name: string;
  description: string;
  brands: {
    id: number;
    name: string;
    isDeleted: boolean;
  }[];
  categories: {
    id: number;
    name: string;
    isDeleted: boolean;
  }[];
  productCondition: string;
  size: string;
  color: string;
  imageUrls: {
    id: number;
    image: string;
  }[];
  tags: string[];
  originalPrice: number;
  sellingPrice: number;
  status: string;
  gender: string;
  reports: any[];
  consignor: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
    createdAt: string;
    cart: any | null;
    reports: any[];
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    username: string;
    authorities: {
      authority: string;
    }[];
  };
  createdAt: string;
};

const ProductDetails = () => {
  const { id } = useParams();
  console.log(id);
  const { data: product } = useGetProductDetail(id) as { data?: Product };
  const items =
    product?.imageUrls?.map((img) => ({
      original: img.image,
      thumbnail: img.image,
    })) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data } = useGetProductAvailable("AVAILABLE");

  console.log(data);
  console.log(product);
  return (
    <main className="min-h-screen my-[80px]">
      <section className="product-details-section">
        <div className="backdrop" />
        <div className="product-details__container">
          <div className="product-details__wrapper">
            <div className="product-details__image">
              {items.length > 0 && (
                <ImageGallery
                  renderLeftNav={(onClick) => (
                    <button
                      className="button-next absolute top-[45%] z-10 left-3 p-1 "
                      onClick={onClick}
                    >
                      <FaCaretLeft
                        className="text-white hover:text-[#d99041]"
                        size={30}
                      />
                    </button>
                  )}
                  renderRightNav={(onClick) => (
                    <button
                      className="button-next absolute top-[45%] z-10 right-3 p-1 "
                      onClick={onClick}
                    >
                      <FaCaretRight
                        className="text-white hover:text-[#d99041]"
                        size={30}
                      />
                    </button>
                  )}
                  items={items}
                  thumbnailPosition="left"
                />
              )}
            </div>
            <div className="product-details__info">
              <p className="product-details__name">{product?.name}</p>
              <p className="product-details__type">
                {product?.brands?.map((brand) => brand.name).join(", ")}
              </p>
              <p className="product-details__category">
                {product?.categories
                  ?.map((category) => category.name)
                  .join(", ")}
              </p>
              <p>
                Size:{" "}
                <span className="product-details__size">{product?.size}</span>
              </p>
              <p>
                Color:{" "}
                <ColorPicker
                  value={product?.color}
                  disabled
                  className="product-details__color"
                />
              </p>
              <p className="product-details__price">
                {formatMoney(product?.sellingPrice)}
              </p>
              <p className="text-[#832F21] text-[15px] mb-4">
                Dùng mã “FODOSHIXINCHAO” để được giảm 10% lần thanh toán đầu
                tiên
              </p>
              <div className="product-details__button flex gap-5">
                <ButtonComponent
                  size="large"
                  bgColor="#d99041"
                  color="white"
                  onClick={() => console.log()}
                >
                  Thêm vào giỏ hàng
                </ButtonComponent>
                <ButtonComponent size="large" bgColor="#d99041" color="white">
                  Thanh toán
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ----------------Recently------------- */}
      <section className="homepage-recently__container">
        <h2 className="homepage-recently__title">Đã xem gần đây</h2>
        <div className="homepage-recently__wrapper">
          <Carousel
            className="homepage-recently__carousel"
            slidesPerView={4}
            spaceBetween={3}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
          >
            {showCardModel?.map((item) => (
              <Carousel.Item className="homepage-recently__carousel-item">
                <ShowCard key={item.id} card={item} />
              </Carousel.Item>
            ))}

            <IoIosArrowForward className="swiper-button-next" />

            <IoIosArrowBack className="swiper-button-prev" />
          </Carousel>
        </div>
      </section>
      {/* ----------------mayLike------------- */}
      <section className="homepage-mayLike__container">
        <h2 className="homepage-mayLike__title">Bạn có thể thích</h2>
        <div className="homepage-mayLike__wrapper">
          <Carousel
            className="homepage-mayLike__carousel"
            slidesPerView={4}
            spaceBetween={3}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
          >
            {showCardModel?.map((item) => (
              <Carousel.Item className="homepage-mayLike__carousel-item">
                <ShowCard key={item.id} card={item} />
              </Carousel.Item>
            ))}

            <IoIosArrowForward className="swiper-button-next" />

            <IoIosArrowBack className="swiper-button-prev" />
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
