import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
interface SideBarHeaderProps {
  name?: string;
  className: string;
}
import "./styles.scss";
import { useNavigate } from "react-router-dom";
function SideBarHeader({ name, className, ...rest }: SideBarHeaderProps) {
  const navigate = useNavigate();
  return (
    <nav className={`sidebar_header ${className}`} {...rest}>
      <ul className="sidebar_header-container">
        <li className="sidebar_header__item">Ký gửi</li>
        {name ? (
          <li className="sidebar_header__item">
            <span>Chào, {name}</span> <FaRegUser />
          </li>
        ) : (
          <li className="sidebar_header__item">Đăng nhập</li>
        )}
        <li className="sidebar_header__item">
          <FiShoppingCart
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/cart");
            }}
            fontSize={24}
          />
        </li>
      </ul>
    </nav>
  );
}

export default SideBarHeader;
