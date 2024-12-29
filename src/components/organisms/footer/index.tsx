import { FaFacebook } from "react-icons/fa6";
import { SlSocialInstagram } from "react-icons/sl";
import { AiFillTwitterCircle } from "react-icons/ai";
import "./styles.scss";
import { logoWhite } from "../../../assets/contant";
function Footer() {
  return (
    <footer>
      <div className="footer__wrapper">
        <div className="footer__right-side">
          <img src={logoWhite} alt="" />
          <p>
            Với sứ mệnh đưa thời trang bền vững trở thành xu thế, FODOSHI mang
            đến cho bạn những lựa chọn second-hand chất lượng, cá tính và độc
            đáo nhất. Hãy thể hiện phong cách cá nhân của bạn ngay hôm nay!
          </p>
        </div>
        <div className="footer__left-side">
          <div className="footer__left-side--item">
            <span>Điều hướng</span>
            <ul>
              <li>Trang chủ</li>
              <li>Hàng mới nhập</li>
              <li>Blog</li>
              <li>Giới thiệu</li>
            </ul>
          </div>
          <div className="footer__left-side--item">
            <span>Sản phẩm</span>
            <ul>
              <li>Brand</li>
              <li>Nữ</li>
              <li>Nam</li>
              <li>Phụ Kiện</li>
            </ul>
          </div>
        </div>
      </div>
      <nav className="footer__hero">
        <span>&copy; 2024 - All rights reserved by AVI</span>
        <ul className="footer__hero-navbar">
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
          <li>Help & Support</li>
        </ul>
        <ul className="footer__hero-icons">
          <li>
            <FaFacebook color="#fff" />
          </li>
          <li>
            <SlSocialInstagram color="#fff" />
          </li>
          <li>
            <AiFillTwitterCircle color="#fff" />
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
