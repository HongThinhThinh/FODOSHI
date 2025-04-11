import { FiShoppingCart } from "react-icons/fi";
interface SideBarHeaderProps {
  name?: string;
  className: string;
}
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Tooltip } from "antd";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useGetCart } from "../../../services/cartService";
import UserAvatar from "../user-avatar";

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
        <li className="sidebar_header__item">
          <Tooltip title="Giỏ hàng">
            <Badge count={cartCount} color="#852f1f">
              <FiShoppingCart
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/cart");
                }}
                fontSize={24}
              />
            </Badge>
          </Tooltip>
        </li>
        {user ? (
          <li className="sidebar_header__item">
            <UserAvatar />
          </li>
        ) : (
          <Link
            to="/login"
            className="sidebar_header__item sidebar_header__item--text"
          >
            Đăng nhập
          </Link>
        )}
      </ul>
    </nav>
  );
}

export default SideBarHeader;
