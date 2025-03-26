import { Navigation } from "swiper/modules";
import {
  bannerHomepage,
  bannerHomepage2,
  reasonCard,
  socialCard,
} from "../../../assets/contant";
import ButtonComponent from "../../atoms/button";
import Carousel from "../../atoms/carousel";
import "./styles.scss";
import ShowCard from "../../atoms/show-card";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ReasonCard from "../../atoms/reason-card";
import SocialCard from "../../atoms/social-card";
import { useGetProductAvailable } from "../../../services/productService";
import { useEffect } from "react";
import AOS from "aos";

import { useMediaQuery } from "react-responsive";
import { showCardModel } from "../../../assets/model";

import { useGetCategory } from "../../../services/adminService";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../atoms/product-ht";
import { TypeAnimation } from "react-type-animation";

function HomePage() {
  const { data: products, refetch } = useGetProductAvailable("AVAILABLE");
  const { data: categories } = useGetCategory();
  const navigate = useNavigate();
  useEffect(() => {
    refetch(); // Gọi lại API khi trang được load lại
  }, [refetch]);
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <>
      {/* -------------Banner------------- */}
      <section className="homepage-banner__container">
        <img
          onClick={() => navigate("/newProduct")}
          className="homepage-banner__img "
          src={bannerHomepage2}
          alt=""
        />
        {/* {isBigScreen && (
          <div
            className="homepage-banner__content"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <h1 className="homepage-banner__content--title">
              <span className="text-[#d99041]">
                <TypeAnimation
                  sequence={[
                    "MÙA HẠ",
                    1000, // Dừng 1 giây
                  ]}
                  wrapper="span"
                  speed={50} // Tốc độ gõ chữ, số càng thấp càng nhanh
                  repeat={0} // Đặt 0 để không lặp lại
                  cursor={false} // Ẩn con trỏ sau khi hoàn thành
                />
              </span>
              'S <br />
              <TypeAnimation
                sequence={[
                  // Đợi để 'MÙA HẠ' xuất hiện trước
                  500,
                  "COLLECTION",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={0}
                cursor={false}
              />
            </h1>
            <p className="homepage-banner__content--desc">
              Thời trang không chỉ "cool" mà còn phải "eco-cool"!
            </p>
            <ButtonComponent
              bgColor="#d99041"
              color="white"
              size="large"
              shape="default"
              className="homepage-banner__content--btn"
              onClick={() => navigate(`/newProduct`)}
            >
              Mua ngay
            </ButtonComponent>
          </div>
        )} */}
      </section>

      {/* -------------Reason------------- */}
      <section className="homepage-reason__container">
        <h1 className="homepage-reason__title" data-aos="fade-up">
          Tại sao nên chọn FODOSHI
        </h1>
        <div className="homepage-reason__wrapper">
          {reasonCard.map((item, index) => (
            <ReasonCard
              key={index}
              content={item.content}
              image={item.image}
              reverse={index % 2 === 0}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* ------------Category------------ */}
      <section className="homepage-category__container" data-aos="fade-up">
        <h2 className="homepage-category__title" data-aos="fade-up">
          Shop theo danh mục
        </h2>
        <div
          className="homepage-category__wrapper"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Carousel
            className="homepage-category__carousel"
            slidesPerView={isBigScreen ? 4 : 1}
            spaceBetween={20}
            initialSlide={0}
            loop={false}
            centeredSlides={false}
            navigation={{
              nextEl: ".swiper-button-next-category",
              prevEl: ".swiper-button-prev-category",
            }}
            modules={[Navigation]}
          >
            {Array.isArray(categories) && categories.length > 0
              ? categories.map((item, index) => (
                  <Carousel.Item
                    className="homepage-category__carousel-item"
                    key={item.id || index}
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div
                      className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => navigate(`/productByCategory/${item?.id}`)}
                    >
                      <div className="homepage-category__image-container overflow-hidden rounded-lg">
                        <img
                          className="homepage-category__item--img w-full h-48 object-cover"
                          src={item?.image}
                          alt={item?.name}
                        />
                      </div>
                      <p className="homepage-category__item--title text-center mt-3 font-medium">
                        {item?.name}
                      </p>
                    </div>
                  </Carousel.Item>
                ))
              : null}
            <button className="swiper-button-next-category absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <IoIosArrowForward className="text-[#d99041]" size={24} />
            </button>
            <button className="swiper-button-prev-category absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <IoIosArrowBack className="text-[#d99041]" size={24} />
            </button>
          </Carousel>
        </div>
      </section>

      {/* ----------------OutfitOfDay----------- */}
      <section className="homepage-outfitOfDay__container" data-aos="fade-up">
        <h2 className="homepage-outfitOfDay__title" data-aos="fade-up">
          Outfit của ngày
        </h2>
        <div
          className="homepage-outfitOfDay__wrapper"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Carousel
            className="homepage-outfitOfDay__carousel"
            slidesPerView={isBigScreen ? 4 : 1}
            spaceBetween={3}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
          >
            {products
              ?.filter((item) => item.deleted === false)
              .map((item, index) => (
                <Carousel.Item
                  className="homepage-outfitOfDay__carousel-item"
                  key={item.id}
                  data-aos="flip-left"
                  data-aos-delay={index * 100}
                >
                  <ProductCard product={item} />
                </Carousel.Item>
              ))}
            <IoIosArrowForward className="swiper-button-next" />
            <IoIosArrowBack className="swiper-button-prev" />
          </Carousel>
        </div>
      </section>

      {/* ------------------Social------------------ */}
      <section className="homepage-social__container" data-aos="fade-up">
        {isBigScreen && (
          <div className="backdrop" data-aos="zoom-in" data-aos-delay="300" />
        )}
        <div className="homepage-social__content">
          <h1 className="homepage-social__title" data-aos="fade-up">
            Các kênh social media
          </h1>
          <div className="homepage-social__wrapper">
            {socialCard.map((item, index) => (
              <SocialCard
                link={item.link}
                key={index}
                title={item.title}
                content={item.content}
                image={item.image}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 150}
              />
            ))}
          </div>
          <h1
            className="homepage-social__title"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Đồng hợp tác
          </h1>
        </div>
      </section>
    </>
  );
}

export default HomePage;
