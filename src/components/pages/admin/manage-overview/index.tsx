import { Button, Col, Row, Statistic } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ShoppingOutlined, MoreOutlined } from "@ant-design/icons";
import CustomizedCard from "../../../molecules/card/Card";
import "./index.scss";
function Dashboard() {
  // const [data, setData] = useState([]);
  const [top5Mentor, seTop5Mentor] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const data = [
    { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
    { name: "May", uv: 189, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
    { name: "Jul", uv: 349, pv: 4300, amt: 2100 },
    { name: "Aug", uv: 400, pv: 2400, amt: 2400 },
    { name: "Sep", uv: 300, pv: 1398, amt: 2210 },
    { name: "Oct", uv: 200, pv: 9800, amt: 2290 },
    { name: "Nov", uv: 278, pv: 3908, amt: 2000 },
    { name: "Dec", uv: 189, pv: 4800, amt: 2181 },
  ];
  const topBrands = [
    {
      id: 1,
      name: "Nike Air Max",
      description: "High-quality sports shoes",
      price: "126,500 VND",
      sales: 999,
      image: "nike.png",
    },
    {
      id: 2,
      name: "Adidas UltraBoost",
      description: "Comfortable running shoes",
      price: "135,000 VND",
      sales: 800,
      image: "adidas.png",
    },
    {
      id: 3,
      name: "Puma Suede",
      description: "Classic street style",
      price: "110,000 VND",
      sales: 600,
      image: "puma.png",
    },
    {
      id: 4,
      name: "Reebok Classic",
      description: "Retro-inspired sneakers",
      price: "95,000 VND",
      sales: 700,
      image: "reebok.png",
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} justify="space-between" className="dashboard__card">
        {[
          { title: "Tổng đơn hàng", value: 0 },
          { title: "Đơn hàng đang hoạt động", value: 0 },
          { title: "Đơn hàng đang hoàn tất", value: 0 },
          { title: "Đơn hàng hoàn trả", value: 0 },
        ].map((item, index) => (
          <Col key={index} flex="1 1 0" style={{ maxWidth: "300px" }}>
            <CustomizedCard width={"100%"} height={"140px"}>
              <div className="dashboard__card__top">
                <div className="dashboard__card__top__left">{item.title}</div>
                <div className="dashboard__card__top__right">
                  <MoreOutlined />
                </div>
              </div>
              <div className="dashboard__card__mid">
                <div className="dashboard__card__mid__left">
                  <ShoppingOutlined />
                </div>
                <div className="dashboard__card__mid__mid">
                  <span>189.000 VND</span>
                </div>
                <div className="dashboard__card__mid__right">
                  <span>34.7%</span>
                </div>
              </div>
              <div className="dashboard__card__bottom">
                <span>So sánh to Oct 2023</span>
              </div>
              {/* <Statistic
                // title={item.title}
                value={item.value}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                suffix=""
              /> */}
            </CustomizedCard>
          </Col>
        ))}
      </Row>
      <div className="dashboard__chart">
        <div className="dashboard__chart__left">
          <div className="dashboard__chart__left__top">
            <div className="dashboard__chart__left__top__left">
              <span>Biểu đồ doanh thu</span>
            </div>
            <div className="dashboard__chart__left__top__right">
              <Button>THEO TUẦN</Button>
              <Button>THEO THÁNG</Button>
              <Button>THEO NĂM</Button>
            </div>
          </div>
          <div className="dashboard__chart__left__bot">
            <LineChart width={700} height={300} data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
          </div>
        </div>
        <div className="dashboard__chart__right">
          <div className="dashboard__chart__right__top">
            <div className="dashboard__chart__right__top__left">
              <span>Những brand bán chạy</span>
            </div>
            <div className="dashboard__chart__right__top__right">
              <MoreOutlined />
            </div>
          </div>
          <div className="dashboard__chart__right__mid">
            {topBrands.map((brand) => (
              <div className="dashboard__chart__right__mid__item" key={brand.id}>
                <div className="dashboard__chart__right__mid__item__left">
                  <div
                    className="dashboard__chart__right__mid__item__left__image"
                    style={{
                      backgroundImage: `url(${brand.image})`,
                      backgroundSize: "cover",
                      width: "50px",
                      height: "50px",
                    }}
                  ></div>
                  <div className="dashboard__chart__right__mid__item__left__brand">
                    <div className="dashboard__chart__right__mid__item__left__brand__name">
                      <span>{brand.name}</span>
                    </div>
                    <div className="dashboard__chart__right__mid__item__left__brand__description">
                      <span>{brand.description}</span>
                    </div>
                  </div>
                </div>
                <div className="dashboard__chart__right__mid__item__right">
                  <div className="dashboard__chart__right__mid__item__right__price">
                    <span>{brand.price}</span>
                  </div>
                  <div className="dashboard__chart__right__mid__item__right__sales">
                    <span>{brand.sales} sales</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard__chart__right__bot">
            <Button style={{ backgroundColor: "#d99041", color: "white" }}>
              Báo cáo hoàn chỉnh
            </Button>
          </div>
        </div>
      </div>

      {/* <PieChart width={400} height={200}>
        <Pie
          dataKey="totalSold"
          nameKey="productName"
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
          label
        />
        <Tooltip />
        <Legend />
      </PieChart> */}
      {/* <BarChart width={500} height={250} data={top5Mentor}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalBooking" fill="#8884d8" />
      </BarChart> */}
    </div>
  );
}

export default Dashboard;
