import { logo } from "../../../assets/contant";
import InputComponent from "../../atoms/input";
import Hero from "../../molecules/header-hero";
import SideBarHeader from "../../molecules/sidebar-header";
import { FaSearch } from "react-icons/fa";
import "./styles.scss";
function Header() {
  return (
    <header>
      <div className="header-container">
        <InputComponent
          bgColor="#dac1bd"
          prefix={<FaSearch />}
          shape="round"
          className="header-input"
          placeholder="Tìm kiếm sản phẩm ..."
        />
        <div className="header-logo">
          <img src={logo} alt="" />
        </div>
        <SideBarHeader className="header-sidebar" name="Trường" />
      </div>
      <nav className="header-hero">
        <Hero />
      </nav>
    </header>
  );
}

export default Header;
