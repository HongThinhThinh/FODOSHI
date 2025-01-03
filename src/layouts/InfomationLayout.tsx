import React, { useState } from "react";
import Header from "../components/organisms/header";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/organisms/footer";
import { Col, Row } from "antd";
import { DataTabType, linkInfomation } from "../assets/contant";

function InfomationLayout() {
  const [tabs, setTabs] = useState<{
    isTab: boolean;
    data: DataTabType[];
  }>({
    isTab: false,
    data: [],
  });
  const location = useLocation();
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
                    location.pathname.split("/")[2] === `${item.path}`
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
          <Col span={17} className={` ${!tabs.isTab && "py-[40px]"}`}>
            {tabs.isTab && (
              <nav className="w-full py-3 border-y-2 border-[#1E3779]">
                <ul className="w-full flex justify-start gap-[12%]">
                  {tabs.data?.map((item, index) => (
                    <li key={index}>
                      <Link
                        className={`text-[16px] font-[600] ${
                          location.pathname.split("/")[3] === item.path
                            ? "py-3 border-b-4 border-[#6F1111]"
                            : ""
                        }`}
                        to={`./${location.pathname.split("/")[2]}/${item.path}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <Outlet
              context={{
                opentab: (tabs) =>
                  setTabs({
                    isTab: tabs.length === 0 ? false : true,
                    data: tabs,
                  }),
              }}
            />
          </Col>
        </Row>
      </main>
      <Footer />
    </>
  );
}

export default InfomationLayout;
