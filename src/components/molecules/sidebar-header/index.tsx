import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
interface SideBarHeaderProps {
  name?: string;
  className: string;
}
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useGetCart } from "../../../services/cartService";
function SideBarHeader({ className, ...rest }: SideBarHeaderProps) {
  const state = useSelector((state: RootState) => state);
  const { user } = state;
  const navigate = useNavigate();
  const getParams = useGetCart();
  const cartData = getParams?.data?.data?.cartItems || [];
  return (
    <nav className={`sidebar_header ${className}`} {...rest}>
      <ul className="sidebar_header-container">
        <Link
          to={"/consignment"}
          className="sidebar_header__item sidebar_header__item--text "
        >
          Ký gửi
        </Link>
        {user ? (
          <li
            onClick={() => navigate("/infomation/infomationPersonal")}
            className="sidebar_header__item sidebar_header__item--text cursor-pointer"
          >
            <span>
              Chào,{" "}
              {user?.name?.includes(" ")
                ? user?.name?.split(" ").pop()
                : user?.name}
            </span>
            <FaRegUser />
          </li>
        ) : (
          <Link
            to="/login"
            className="sidebar_header__item sidebar_header__item--text "
          >
            Đăng nhập
          </Link>
        )}
        <li className="sidebar_header__item">
          <Badge count={cartData.length}>
            <FiShoppingCart
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/cart");
              }}
              fontSize={24}
            />
          </Badge>
        </li>
      </ul>
    </nav>
  );
}

export default SideBarHeader;
