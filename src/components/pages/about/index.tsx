import React, { useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../atoms/button";

function About() {
  const navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("Bắt đầu ngay");

  const tabs = [
    {
      id: "Bắt đầu ngay",
      image: "/about/3.png",
      description:
        'Dễ dàng ký gửi với hai lựa chọn "Trực tiếp đến cửa hàng" hoặc "Đơn vị vận chuyển đến nhà lấy"',
    },
    {
      id: "Đóng gói đơn hàng",
      image: "/about/3.png",
      description:
        "Đóng gói quần áo của bạn một cách cẩn thận và đảm bảo chúng ở trong tình trạng tốt nhất",
    },
    {
      id: "Kiểm tra đơn giá",
      image: "/about/3.png",
      description:
        "Chúng tôi sẽ đánh giá đơn hàng của bạn dựa trên thương hiệu, chất lượng và xu hướng",
    },
    {
      id: "Quyên góp và tái chế",
      image: "/about/3.png",
      description:
        "Những món đồ không phù hợp để bán lại sẽ được quyên góp hoặc tái chế có trách nhiệm",
    },
  ];

  return (
    <div className="about">
      <div className="about__container">
        {/* Navigation path */}
        <div className="about__top">
          <div className="about__navigation">
            <span className="home-link" onClick={() => navigation("/")}>
              Trang chủ
            </span>
            <span className="separator">{">"}</span>
            <span className="current-page">Giới thiệu</span>
          </div>
          <h1 className="about__title">về FODOSHI...</h1>
        </div>

        {/* Hero section */}
        <section className="about__hero">
          <div className="hero__content">
            <h2 className="hero__title">
              Giải phóng không gian tủ quần áo dễ dàng với Fodoshi
            </h2>
            <ButtonComponent
              className="hero__button"
              bgColor="#832F21"
              color="white"
              onClick={() => navigation("/consignment")}
            >
              Bắt đầu ngay
            </ButtonComponent>
          </div>
          <div className="hero__images">
            <div className="image-container">
              <img className="image-main" src="/about/2.png" alt="Tủ quần áo" />
              <div className="image-overlay">
                <img src="/about/1.png" alt="Thời trang bền vững" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="about__process">
          <h2 className="process__title">
            Bạn chỉ cần gửi đồ, việc còn lại để Fodoshi
          </h2>

          <div className="process__content">
            <div className="process__tabs">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.id}
                </div>
              ))}
            </div>

            <div className="process__visual">
              <img
                src={tabs.find((tab) => tab.id === activeTab)?.image}
                alt={activeTab}
              />
            </div>

            <div className="process__description">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </div>
          </div>
        </section>

        {/* Pricing criteria */}
        <section className="about__criteria">
          <h2 className="criteria__title">
            Chúng tôi định giá theo các tiêu chí sau
          </h2>

          <div className="criteria__cards">
            <div className="criteria__card">
              <img
                className="criteria__icon"
                src="/about/4.png"
                alt="Thương hiệu"
              />
              <h3 className="criteria__name">Thương hiệu</h3>
              <img
                className="criteria__arrow"
                src="/about/5.png"
                alt="Chi tiết"
              />
            </div>

            <div className="criteria__card">
              <img
                className="criteria__icon"
                src="/about/6.png"
                alt="Xu hướng"
              />
              <h3 className="criteria__name">Xu hướng</h3>
              <img
                className="criteria__arrow"
                src="/about/5.png"
                alt="Chi tiết"
              />
            </div>

            <div className="criteria__card">
              <img
                className="criteria__icon"
                src="/about/7.png"
                alt="Chất lượng"
              />
              <h3 className="criteria__name">Chất lượng</h3>
              <img
                className="criteria__arrow"
                src="/about/5.png"
                alt="Chi tiết"
              />
            </div>
          </div>
        </section>

        {/* Pricing table */}
        <section className="about__pricing">
          <div className="pricing__table">
            <div className="pricing__column">
              <h3 className="pricing__header">Giá bán sản phẩm</h3>
              <div className="pricing__row">100.000 - 199.000</div>
              <div className="pricing__row">200.000 - 499.000</div>
              <div className="pricing__row">500.000 - 999.000</div>
              <div className="pricing__row">1.000.000 - 1.999.000</div>
              <div className="pricing__row">2.000.000 trở lên</div>
            </div>

            <div className="pricing__column">
              <h3 className="pricing__header">Tỷ lệ hoa hồng của seller</h3>
              <div className="pricing__row">10% - 15%</div>
              <div className="pricing__row">15% - 30%</div>
              <div className="pricing__row">30% - 50%</div>
              <div className="pricing__row">50% - 75%</div>
              <div className="pricing__row">70%</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
