import React from "react";
import Header from "../components/organisms/header";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/organisms/footer";
import { Col, Row } from "antd";
import { linkInfomation } from "../assets/contant";

function InfomationLayout() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      <Header />
      <main className="min-h-screen my-[80px]">
        <Row className="min-h-screen w-full">
          <Col span={7} className="pl-[35px] pr-[10px] h-full">
            <h1 className="text-[36px] font-[400] mb-4">Thông tin tài khoản</h1>
            <ul className="flex justify-center flex-col gap-4 text-[18px]">
              {linkInfomation?.map((item, index) => (
                <li
                  key={index}
                  className={`${
                    location.pathname === `/infomation/${item.path}`
                      ? "underline"
                      : ""
                  }`}
                >
                  <Link to={item.path} className="uppercase">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col span={17}>
            <Outlet />
          </Col>
        </Row>
      </main>
      <Footer />
    </>
  );
}

export default InfomationLayout;
