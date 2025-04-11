import { useState, useRef, useEffect } from "react";
import { Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/userSlice";
import { toast } from "react-toastify";
import "./styles.scss";
import getCurrentUser, { UserData } from "../../../utils/getCurrentUser";

const UserAvatar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Nếu không lấy được dữ liệu, có thể người dùng chưa đăng nhập
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Đăng xuất thành công");
  };

  // Lấy tên hiển thị của người dùng
  const displayName = user?.name?.includes(" ")
    ? user?.name?.split(" ").pop()
    : user?.name;
  const items = [
    {
      key: "profile",
      label: "Thông tin tài khoản",
      icon: <UserAddOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "orders",
      label: "Đơn hàng",
      icon: <MdOutlineShoppingBag size={16} />,
      onClick: () => navigate("/orders"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Delay 300ms before hiding
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Nếu đang loading hoặc không có user, hiển thị avatar mặc định
  if (loading || !user) {
    return (
      <div className="avatar-wrapper">
        <Avatar size={40} icon={<UserOutlined />} className="user-avatar" />
      </div>
    );
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    // Chỉ chuyển hướng khi click vào avatar hoặc tên, không phải dropdown item
    if (!(e.target as HTMLElement).closest(".ant-dropdown-menu-item")) {
      navigate("/profile");
    }
  };

  return (
    <div
      className="user-avatar-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        open={isHovered}
        overlayStyle={{ minWidth: 200 }}
      >
        <div className="avatar-wrapper" onClick={handleProfileClick}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={user?.image}
            className="user-avatar"
          />
          <span className="user-name">Xin chào, {displayName}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserAvatar;
