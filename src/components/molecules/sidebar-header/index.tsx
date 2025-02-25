import { FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
interface SideBarHeaderProps {
  name?: string;
  className: string;
}
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
function SideBarHeader({ className, ...rest }: SideBarHeaderProps) {
  const state = useSelector((state: RootState) => state);
  const { user } = state;
  const navigate = useNavigate();
  console.log(user);
  console.log(state.cart);
  return (
    <nav className={`sidebar_header ${className}`} {...rest}>
      <ul className="sidebar_header-container">
        <li className="sidebar_header__item sidebar_header__item--text ">
          Ký gửi
        </li>
        {user ? (
          <li
            onClick={() => navigate("/infomation/infomationPersonal")}
            className="sidebar_header__item sidebar_header__item--text cursor-pointer"
          >
            <span>Chào, {user?.name}</span> <FaRegUser />
          </li>
        ) : (
          <li className="sidebar_header__item sidebar_header__item--text ">
            Đăng nhập
          </li>
        )}
        <li className="sidebar_header__item">
          <Badge count={state.cart?.products?.length}>
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
