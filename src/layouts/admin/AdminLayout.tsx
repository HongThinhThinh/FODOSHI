/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "antd";
import { useState } from "react";
import HeaderAdmin from "../../components/organisms/header-admin";
import { logo } from "../../assets/contant";
import "./index.scss";
import { RouteType } from "../../dummy-data/mockAdminRouteData";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/userSlice";
import { LogoutOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export interface AdminLayoutCustomProps {
  routes: RouteType[];
}

export default function AdminLayoutCustom({ routes }: AdminLayoutCustomProps) {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
  const [section, setSection] = useState<{
    isSectionActive: boolean;
    categoriesPath: RouteType[];
  }>();
  const [onCollapseCategory, setOnCollapseCategory] = useState(false);
  console.log(currentSubPath);
  const handleOnCollapseCategory = () => {
    setOnCollapseCategory(!onCollapseCategory);
  };

  // Add these hooks at the top of your component
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add the handleLogout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div className="admin-layout-custom">
      <Row className="admin-layout-custom__container" gutter={0}>
        <Col span={4} className="admin-layout-custom__container__sidebar">
          <div className="admin-layout-custom__container__sidebar__logo">
            <img src={logo} />
          </div>
          <div className="admin-layout-custom__container__sidebar__navigate">
            <>
              {routes.map((route, index) => (
                <Link key={index} to={route.path}>
                  <div
                    className={`admin-layout-custom__container__sidebar__navigate__item ${
                      currentPath === route.path
                        ? "admin-layout-custom__container__sidebar__navigate__item--active"
                        : ""
                    } `}
                  >
                    <div className="admin-layout-custom__container__sidebar__navigate__item__icon">
                      {route.icon}
                    </div>
                    <div className="admin-layout-custom__container__sidebar__navigate__item__name">
                      {route.name}
                    </div>
                  </div>
                </Link>
              ))}
            </>
            <div className="admin-layout-custom__container__sidebar__navigate__item">
              <div
                onClick={handleLogout}
                className="admin-layout-custom__container__sidebar__navigate__item__icon"
              >
                <button className="admin-layout-custom__container__sidebar__logout-btn flex">
                  {" "}
                  <LogoutOutlined />
                </button>
              </div>
              <div className="admin-layout-custom__container__sidebar__navigate__item__name">
                <span>Logout</span>
              </div>
            </div>
          </div>

          <div className="admin-layout-custom__container__sidebar__collapse"></div>
        </Col>
        <Col span={20} className="admin-layout-custom__container__content">
          <HeaderAdmin />
          <div className="admin-layout-custom__container__content__section">
            {section?.isSectionActive && (
              <nav className="admin-layout-custom__container__content__section__navigate">
                <ul>
                  {section.categoriesPath?.map((categoryPath, index) => (
                    <li key={index}>
                      <div
                        className={`admin-layout-custom__container__content__section__navigate__item ${
                          categoryPath.path === currentSubPath
                            ? "admin-layout-custom__container__content__section__navigate__item--active"
                            : ""
                        } `}
                      >
                        <Link to={`categories/${categoryPath.path}`}>
                          {categoryPath.name}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
          <main
            style={{}}
            className="admin-layout-custom__container__content__outlet"
          >
            <Outlet
              context={{
                activateCategoryLayout: (categories: any) => {
                  setSection({
                    isSectionActive: categories.length === 0 ? false : true,
                    categoriesPath: categories,
                  });
                },
              }}
            />
          </main>
        </Col>
      </Row>
    </div>
  );
}
