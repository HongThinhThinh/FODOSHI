import React, { useState } from "react";
import "./index.scss";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  RightOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { icon } from "@fortawesome/fontawesome-svg-core";
export default function HeaderAdmin() {
  const [isUserDrop, setIsUserDrop] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[0];
  const handleChangeUserDropdown = () => {
    setIsUserDrop(!isUserDrop);
  };
  console.log(currentPath);

  const dropdownData = [
    {
      name: "Profile",
      icon: <RightOutlined />,
      path: "profile",
    },
    {
      name: "Đổi mật khẩu",
      icon: <RightOutlined />,
      path: "changePassword",
    },

    {
      name: "Đăng xuất",
      icon: <LogoutOutlined />,
      path: "logout",
    },
  ];

  return (
    <div className="header-admin">
      <div className="header-admin__left"></div>
      <div className="header-admin__right">
        <div className="header-admin__right__item">
          <div className="header-admin__right__item__search">
            <SearchOutlined />
          </div>
          <div className="header-admin__right__item__notification">
            <BellOutlined />
          </div>

          <div className="header-admin__right__item__user">
            <UserOutlined onClick={handleChangeUserDropdown} />
            <div
              className={`header-admin__right__item__user__dropdown ${
                isUserDrop ? "header-admin__right__item__user__dropdown--active" : ""
              } `}
            >
              <div className="header-admin__right__item__user__dropdown__title">Admin</div>
              <div className="header-admin__right__item__user__dropdown__items">
                {dropdownData.map((item, index) => (
                  <Link key={index} to={`${currentPath}/${item.path}`}>
                    <div className="header-admin__right__item__user__dropdown__items__item">
                      <div className="header-admin__right__item__user__dropdown__items__item__name">
                        {item.name}
                      </div>
                      <div className="header-admin__right__item__user__dropdown__items__item__icon">
                        {item.icon}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
