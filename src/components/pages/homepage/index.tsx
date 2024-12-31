import { Navigation, Pagination } from "swiper/modules";
import { bannerHomepage, category, imageGirl } from "../../../assets/contant";
import ButtonComponent from "../../atoms/button";
import Carousel from "../../atoms/carousel";
import "./styles.scss";
import { showCardModel } from "../../../assets/model";
import ShowCard from "../../atoms/show-card";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
function HomePage() {
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
      {/* ------------Category------------ */}
      <section className="homepage-category__container">
        <h2 className="homepage-category__title">Shop theo danh mục</h2>
        <div className="homepage-category__wrapper">
          {category.map((item, index) => (
            <div key={index} className="homepage-category__item">
              <img
                className="homepage-category__item--img"
                src={item.image}
                alt=""
              />
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
            {showCardModel?.map((item) => (
              <Carousel.Item className="homepage-outfitOfDay__carousel-item">
                <ShowCard key={item.id} card={item} />
              </Carousel.Item>
            ))}

            <IoIosArrowForward className="swiper-button-next" />

            <IoIosArrowBack className="swiper-button-prev" />
          </Carousel>
        </div>
      </section>

      {/* ------------------OutfitToClass----------------- */}
      <section className="homepage-outfitToClass__container">
        <div className="homepage-outfitToClass__wrapper">
          <img className="homepage-outfitToClass__img" src={imageGirl} alt="" />
          <div className="homepage-outfitToClass__content">
            <span className="text-[26px] font-[300] ">28/10/2024</span>
            <div className="flex justify-center items-center flex-col gap-[12px]">
              <div className="w-[40px] h-[40px] bg-[#832f21] rounded-full" />
              <p className="text-[26px] font-[550]">@Fodoshi</p>
              <p className="text-[26px] font-[550]">
                Diện đồ đẹp đi làm là số zách!
              </p>
              <p className="text-[26px] font-[550]">#OOTD #FODOSHI #OUTFIT</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
