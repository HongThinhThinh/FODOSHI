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
type Product = {
  name?: string;
  image?: string;
  size?: number;
  type?: string;
  price?: number;
};

const ProductDetails = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<Product>({});
  console.log(id);

  useEffect(() => {
    setProductDetail(showCardModel[1]);
    console.log(productDetail);
  }, []);

  const images = [
    {
      original: "https://placehold.co/600x402",
      thumbnail: "https://placehold.co/600x402",
    },
    {
      original: "https://placehold.co/600x400",
      thumbnail: "https://placehold.co/600x400",
    },
    {
      original: "https://placehold.co/600x401",
      thumbnail: "https://placehold.co/600x400",
    },
  ];

  return (
    <main className="min-h-screen my-[80px]">
      <section className="product-details-section">
        <div className="backdrop" />
        <div className="product-details__container">
          <div className="product-details__wrapper">
            <div className="product-details__image">
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
                items={images}
                thumbnailPosition="left"
              />
            </div>
            <div className="product-details__info">
              <p className="product-details__name">{productDetail?.name}</p>
              <p className="product-details__type">{productDetail?.type}</p>
              <p>
                Size:{" "}
                <span className="product-details__size">
                  {productDetail?.size}
                </span>
              </p>
              <p className="product-details__price">
                {formatMoney(productDetail?.price)}
              </p>
              <p className="text-[#832F21] text-[15px] mb-4">
                Dùng mã “FODOSHIXINCHAO” để được giảm 10% lần thanh toán đầu
                tiên
              </p>
              <div className="product-details__button flex gap-5">
                <ButtonComponent size="large" bgColor="#d99041" color="white">
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
