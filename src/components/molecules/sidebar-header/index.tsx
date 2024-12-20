import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
interface SideBarHeaderProps {
  name?: string;
  className: string;
}
import "./styles.scss";
function SideBarHeader({ name, className, ...rest }: SideBarHeaderProps) {
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
          <FiShoppingCart fontSize={24} />
        </li>
      </ul>
    </nav>
  );
}

export default SideBarHeader;
