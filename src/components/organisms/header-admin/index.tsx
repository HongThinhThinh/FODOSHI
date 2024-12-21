import React from "react";
import "./index.scss";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
export default function HeaderAdmin() {
  return (
    <div className="header-admin">
      <div className="header-admin__left"></div>
      <div className="header-admin__right">
        <div className="header-admin__right__item">
          <SearchOutlined />
          <BellOutlined />
          <UserOutlined />
        </div>
      </div>
    </div>
  );
}
