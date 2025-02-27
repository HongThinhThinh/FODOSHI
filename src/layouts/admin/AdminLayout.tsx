/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Row } from "antd";
import { useState } from "react";
import HeaderAdmin from "../../components/organisms/header-admin";
import { logo } from "../../assets/contant";
import "./index.scss";
import {
  fashionCategoryRoutesData,
  ProductCategoryRoute,
  RouteType,
} from "../../dummy-data/mockAdminRouteData";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

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

  return (
    <div className="admin-layout-custom">
      <Row className="admin-layout-custom__container" gutter={0}>
        <Col span={4} className="admin-layout-custom__container__sidebar">
          <div className="admin-layout-custom__container__sidebar__logo">
            <img src={logo} />
          </div>
          <div className="admin-layout-custom__container__sidebar__navigate">
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
          </div>
          <div className="admin-layout-custom__container__sidebar__categories">
            <Link onClick={handleOnCollapseCategory} to={"categories"}>
              <div className="admin-layout-custom__container__sidebar__categories__title">
                <div className="admin-layout-custom__container__sidebar__categories__title__name">
                  Categories
                </div>
                <div className="admin-layout-custom__container__sidebar__categories__title__collapse">
                  {onCollapseCategory ? (
                    <CaretDownOutlined />
                  ) : (
                    <CaretUpOutlined />
                  )}
                </div>
              </div>
            </Link>
            {onCollapseCategory && (
              <ul>
                {fashionCategoryRoutesData.map(
                  (category: ProductCategoryRoute) => (
                    <li key={category.id}>
                      <Link to={`categories/${category.path}`}>
                        <div
                          className={`admin-layout-custom__container__sidebar__categories__item ${
                            category.path === currentSubPath
                              ? "admin-layout-custom__container__sidebar__categories__item--active"
                              : ""
                          }`}
                        >
                          <div className="admin-layout-custom__container__sidebar__categories__item__name">
                            {category.name}
                          </div>
                          <div className="admin-layout-custom__container__sidebar__categories__item__quantity">
                            {category.quantity}
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            )}

            <ul></ul>
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
