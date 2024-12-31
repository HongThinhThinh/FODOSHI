import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../atoms/button";

function About() {
  const navigation = useNavigate();
  return (
    <div className="about">
      <div className="about__top">
        <div className="about__top navigation">
          <span
            className="home"
            onClick={() => {
              navigation("/");
            }}
          >
            Trang chủ
          </span>
          <span>{">"}</span>
          <span>Giới thiệu</span>
        </div>
        <p>về FODOSHI...</p>
      </div>
      <div className="about__bottom">
        <div className="part-one">
          <div className="description">
            Giải phóng không gian tủ quần áo dễ dàng với Fodoshi
            <ButtonComponent
              className="block"
              bgColor="#832F21"
              color="white"
              children={"Bắt đầu ngay"}
            />
          </div>
          <div className="images">
            <div className="image2">
              <img src={"/public/about/2.png"} alt="" />
              <div className="image1">
                <img src={"/public/about/1.png"} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="part-two">
          <div>Bạn chỉ cần gửi đồ, việc còn lại để Fodoshi</div>
          <div>
            <div className="content">
              <div className="selection">
                <p className="choosen">Bắt đầu ngay</p>
                <p>Đóng gói đơn hàng</p>
                <p>Kiểm tra đơn giá</p>
                <p>Quyên góp và tái chế</p>
              </div>
              <div className="image">
                <img src="/public/about/3.png" alt="" />
              </div>
              <div className="description">
                Dễ dàng ký gửi với hai lựa chọn "Trực tiếp đến cửa hàng" hoặc
                "Đơn vị vận chuyển đến nhà lấy"
              </div>
            </div>
          </div>
        </div>

        <div className="part-three">
          Chúng tôi định giá theo các tiêu chí sau
          <div className="part-three__bottom">
            <div className="item">
              <img src="/public/about/4.png" alt="" />
              <p>Thương hiệu</p>
              <img src="/public/about/5.png" alt="" />
            </div>
            <div className="item">
              <img src="/public/about/6.png" alt="" />
              <p>Xu hướng</p>
              <img src="/public/about/5.png" alt="" />
            </div>
            <div className="item">
              <img src="/public/about/7.png" alt="" />
              <p>Chất lượng</p>
              <img src="/public/about/5.png" alt="" />
            </div>
          </div>
        </div>
        <div className="part-four">
          <div className="item">
            <b>Giá bán sản phẩm</b>
            <p>100.000 - 199.000</p>
            <p>200.000 - 499.000</p>
            <p>500.000 - 999.000</p>
            <p>1.000.000 - 1.999.000</p>
            <p>2.000.000 trở lên</p>
          </div>
          <div className="item">
            <b>Tỷ lệ hoa hồng của seller</b>
            <p>10% - 15%</p>
            <p>15% - 30%</p>
            <p>30% - 50%</p>
            <p>50% - 75%</p>
            <p>70%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
