import { FaFacebook } from "react-icons/fa6";
import { SlSocialInstagram } from "react-icons/sl";
import { AiFillTwitterCircle } from "react-icons/ai";
import "./styles.scss";
import { logoWhite } from "../../../assets/contant";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer>
      <div className="footer__wrapper">
        <div className="footer__right-side">
          <img src={logoWhite} alt="Fodoshi Shop Logo" />
          <h4>Địa chỉ cửa hàng</h4>
          <address>
            <p>S605 Vinhome Grand Park, Long Bình, Quận 9, Thành Phố Thủ Đức</p>
            <p>
              Email:{" "}
              <a href="mailto:fodoshishop@gmail.com">fodoshishop@gmail.com</a>
            </p>
            <p>
              Phone: <a href="tel:0394768801">0394 768 801</a>
            </p>
          </address>
        </div>
        <iframe
          title="Bản đồ vị trí Fodoshi Shop"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5163.53523020789!2d106.83652651168461!3d10.844014789264321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752194930913ff%3A0xa8bf884e11f5890f!2sS6.05%20-%20Vinhomes%20Grand%20Park!5e1!3m2!1sen!2s!4v1742979640319!5m2!1sen!2s"
          width="300"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* <div className="footer__left-side">
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
        </div> */}
      </div>
      <nav className="footer__hero">
        <span>&copy; 2025 - All rights reserved by AVI</span>
        <ul className="footer__hero-navbar">
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
          <li>Help & Support</li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
