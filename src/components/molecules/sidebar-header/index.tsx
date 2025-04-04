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
  const cartRedux = useSelector((state: RootState) => state.cart?.items || []);
  const navigate = useNavigate();

  // Only fetch cart data from API if user is logged in
  const getParams = useGetCart({
    enabled: !!user, // Only enable the query when user exists
  });

  // Use API data for logged in users, Redux data for guests
  const cartData = user ? getParams?.data?.data?.cartItems || [] : cartRedux;

  // Get final cart count based on authentication status
  const cartCount = user ? cartData.length : cartRedux.length;

  return (
    <nav className={`sidebar_header ${className}`} {...rest}>
      <ul className="sidebar_header-container">
        {/* <div
          onClick={() => {
            if (user) {
              navigate("/consignment");
            } else {
              navigate("/login", {
                state: {
                  from: "/consignment",
                  message: "Vui lòng đăng nhập để sử dụng tính năng ký gửi",
                },
              });
            }
          }}
          className="sidebar_header__item sidebar_header__item--text cursor-pointer"
        >
          Ký gửi
        </div> */}
        {user ? (
          <li
            onClick={() => navigate("/profile")}
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
          <Badge count={cartCount}>
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
