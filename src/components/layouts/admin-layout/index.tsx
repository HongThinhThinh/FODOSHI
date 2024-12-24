import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import { MdOutlineTopic } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ButtonComponent from "../../atoms/button";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../../redux/features/userSlice";
import { FcDataConfiguration } from "react-icons/fc";
import { FaChartPie } from "react-icons/fa";
import HeaderAdmin from "../../organisms/header-admin";
import { toTitle } from "../../../utils/formatStr";
import { logo } from "../../../assets/contant";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/admin/${key}`}> {label} </Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "dashboard", <FaChartPie />),
  getItem("Tất cả sản phẩm", "products", <FcDataConfiguration />),
  getItem("Danh sách đơn", "orders", <SlCalender />),
];
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("dashboard");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out");
  };
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        style={{ backgroundColor: "white" }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <img style={{ padding: "20px 10px 5px 10px" }} src={logo}></img>
        <div className="demo-logo-vertical" />
        <Menu
          className="menu-sidebar"
          style={{
            height: "100%",
          }}
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onClick={(e) => setSelectedKey(e.key)}
        />
        <div className="w-full menu-sidebar flex justify-center">
          <ButtonComponent
            onClick={handleLogout}
            // styleClass="h-[51px] w-[51px]  mb-12 text-white flex justify-center items-center bg-gradient-to-b from-[#504C51] to-[#323033]"
          >
            <LogoutOutlined className="text-[18px] stroke-white stroke-[10px]" />
          </ButtonComponent>
        </div>
      </Sider>
      <Layout
        style={{
          overflowY: "auto",
        }}
      >
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <HeaderAdmin />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              height: "100%",
              //   background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <h1 style={{ fontWeight: "600", fontSize: "24px" }}>{toTitle(selectedKey)}</h1>
            <h3>
              <Link to="/">Trang chủ</Link>
              {" > "}
              <Link to={`${selectedKey}`}>{toTitle(selectedKey)}</Link>
            </h3>
            <Outlet />
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>
          Mentor Bridge ©{new Date().getFullYear()} Created by Thịnh Nhi Trân Đạt Minh
        </Footer> */}
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
