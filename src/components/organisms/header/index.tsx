import { logo, navbar } from "../../../assets/contant";
import InputComponent from "../../atoms/input";
import Hero from "../../molecules/header-hero";
import SideBarHeader from "../../molecules/sidebar-header";
import { FaSearch } from "react-icons/fa";
import "./styles.scss";
import { HiBars3 } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Drawer } from "antd";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });
  return (
    <>
      <header className="fixed inset-0 z-10 bg-white h-fit">
        <div className="header-container">
          {isBigScreen && (
            <InputComponent
              bgColor="#dac1bd"
              prefix={<FaSearch />}
              shape="round"
              className="header-input"
              placeholder="Tìm kiếm sản phẩm ..."
            />
          )}

          <div
            className="header-logo"
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="" />
          </div>
          {isBigScreen ? (
            <SideBarHeader className="header-sidebar" />
          ) : (
            <nav className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <HiBars3 size={40} />
            </nav>
          )}
        </div>
        {isBigScreen && (
          <nav className="header-hero">
            <Hero />
          </nav>
        )}
      </header>
      <Drawer
        closeIcon={<GrClose />}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        <InputComponent
          bgColor="#dac1bd"
          prefix={<FaSearch />}
          shape="round"
          className="header-input w-full mb-5"
          placeholder="Tìm kiếm sản phẩm ..."
        />
        <ul className="flex flex-col">
          {navbar.map((item, index) => (
            <li className="navbar-item py-4  border-b-2" key={index}>
              <Link
                className="w-full inline-block hover:text-[#852f1f]"
                to={item.path}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}

export default Header;
