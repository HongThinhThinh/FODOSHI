import { Navigation, Pagination } from "swiper/modules";
import { bannerHomepage, category, reasonCard, socialCard } from "../../../assets/contant";
import ButtonComponent from "../../atoms/button";
import Carousel from "../../atoms/carousel";
import "./styles.scss";
import { showCardModel } from "../../../assets/model";
import ShowCard from "../../atoms/show-card";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import ReasonCard from "../../atoms/reason-card";
import SocialCard from "../../atoms/social-card";
import { useGetProduct } from "../../../services/productService";
function HomePage() {
  const { data: products } = useGetProduct();
  console.log(products);
  return (
    <>
      {/* -------------Banner------------- */}
      <section className="homepage-banner__container">
        <img className="homepage-banner__img" src={bannerHomepage} alt="" />
        <div className="homepage-banner__content">
          <h1 className="homepage-banner__content--title">
            <span className="text-[#d99041]">MÙA HẠ</span>’S <br /> COLLECTION
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
          >
            Mua ngay
          </ButtonComponent>
        </div>
      </section>
      {/* -------------Reason------------- */}
      <section className="homepage-reason__container">
        <h1 className="homepage-reason__title">Tại sao nên chọn FODOSHI</h1>
        <div className="homepage-reason__wrapper">
          {reasonCard.map((item, index) => (
            <ReasonCard
              key={index}
              content={item.content}
              image={item.image}
              reverse={index % 2 === 0 ? true : false}
            />
          ))}
        </div>
      </section>
      {/* ------------Category------------ */}
      <section className="homepage-category__container">
        <h2 className="homepage-category__title">Shop theo danh mục</h2>
        <div className="homepage-category__wrapper">
          {category.map((item, index) => (
            <div key={index} className="homepage-category__item">
              <img className="homepage-category__item--img" src={item.image} alt="" />
              <p className="homepage-category__item--title">{item.title}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ----------------OutfitOfDay----------- */}

      <section className="homepage-outfitOfDay__container">
        <h2 className="homepage-outfitOfDay__title">Outfit của ngày</h2>
        <div className="homepage-outfitOfDay__wrapper">
          <Carousel
            className="homepage-outfitOfDay__carousel"
            slidesPerView={4}
            spaceBetween={3}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
          >
            {Array.isArray(products) ? (
              products.map((item) => (
                <Carousel.Item key={item.id}>
                  <ShowCard card={item} />
                </Carousel.Item>
              ))
            ) : (
              <p>Không có dữ liệu sản phẩm</p>
            )}

            <IoIosArrowForward className="swiper-button-next" />

            <IoIosArrowBack className="swiper-button-prev" />
          </Carousel>
        </div>
      </section>

      {/* ------------------Social------------------ */}
      <section className="homepage-social__container">
        <div className="backdrop" />
        <div className="homepage-social__content">
          <h1 className="homepage-social__title">Các kênh social media</h1>
          <div className="homepage-social__wrapper">
            {socialCard.map((item, index) => (
              <SocialCard
                key={index}
                title={item.title}
                content={item.content}
                image={item.image}
              />
            ))}
          </div>
          <h1 className="homepage-social__title">Đồng hợp tác</h1>
        </div>
      </section>
    </>
  );
}

export default HomePage;
