import React, { useState } from "react";
import "./index.scss";
import {
  CalendarOutlined,
  DownOutlined,
  MoreOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Dropdown, Menu, Row, Table } from "antd";
import CustomizedCard from "../../../molecules/card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { formatMoney } from "../../../../utils/formatMoney";
import { toTitle } from "../../../../utils/formatStr";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const [status, setStatus] = useState<string>("Đổi trạng thái");
  const { id } = useParams();
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatMoney(price),
    },

    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (_, record) => {
        const total = record.price * record.quantity;
        return <span>{formatMoney(total)}</span>;
      },
    },
  ];
  const dataSource = [
    {
      key: "1",
      product: "Áo thun nam",
      orderId: "ORD12345",
      quantity: 2,
      price: 200000,
    },
    {
      key: "2",
      product: "Quần jeans nữ",
      orderId: "ORD12346",
      quantity: 1,
      price: 500000,
    },
    {
      key: "3",
      product: "Giày thể thao",
      orderId: "ORD12347",
      quantity: 1,
      price: 1200000,
    },
    {
      key: "4",
      product: "Đồng hồ đeo tay",
      orderId: "ORD12348",
      quantity: 1,
      price: 3000000,
    },
    {
      key: "5",
      product: "Balo thời trang",
      orderId: "ORD12349",
      quantity: 3,
      price: 350000,
    },
  ];
  const handleMenuClick = (e) => {
    setStatus(e.key);
    console.log("Selected status:", e.key);
  };
  const statusMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="pending">Pending</Menu.Item>
      <Menu.Item key="processing">Processing</Menu.Item>
      <Menu.Item key="completed">Completed</Menu.Item>
      <Menu.Item key="cancelled">Cancelled</Menu.Item>
    </Menu>
  );
  return (
    <div className="order-details">
      <div className="order-details__info">
        <div className="order-details__info__header">
          <div className="order-details__info__header__id">Đơn hàng ID : #{id}</div>
          <div className="order-details__info__header__status">
            <span>Đang chờ thanh toán</span>
          </div>
        </div>
        <div className="order-details__info__sub-header">
          <div className="order-details__info__sub-header__date">
            <CalendarOutlined /> <span>Feb 16 , 2022 - Feb 20 , 2022</span>
          </div>
          <div className="order-details__info__sub-header__tools">
            <Dropdown overlay={statusMenu} trigger={["click"]}>
              <Button className="order-details__info__sub-header__tools__status">
                <span>{toTitle(status)}</span> <DownOutlined />
              </Button>
            </Dropdown>
            <button className="order-details__info__sub-header__tools__print">
              <PrinterOutlined />
            </button>
            <button className="order-details__info__sub-header__tools__save">
              <span>Lưu</span>
            </button>
          </div>
        </div>
        <div className="order-details__info__customer-info">
          <Row
            gutter={[16, 16]}
            justify="space-between"
            className="order-details__info__customer-info__container"
          >
            {[
              {
                title: "Khách hàng",
                value: 0,
                icon: <UserOutlined />,
                details: (
                  <div>
                    <div>Họ và tên : Shristi Singh</div>
                    <div>Email : shristi@gmail.com</div>
                    <div>Tel : +91 904 231 1212</div>
                  </div>
                ),
              },
              {
                title: "Thông tin đơn hàng",
                value: 0,
                icon: <ShoppingOutlined />,
                details: (
                  <div>
                    <div>Vận chuyển: Viettel Post</div>
                    <div>Hình thức thanh toán : Paypal</div>
                    <div>Trạng thái : Pending</div>
                  </div>
                ),
              },
              {
                title: "Địa chỉ giao",
                value: 0,
                icon: <ShoppingOutlined />,
                details: (
                  <div>
                    <span>Địa chỉ: Dharam Colony , Palam Vihar, Gurgaon, Haryana </span>
                  </div>
                ),
              },
            ].map((item, index) => (
              <Col key={index} flex="1 1 0" style={{ maxWidth: "360px" }}>
                <CustomizedCard
                  styleClass="borderRadius"
                  width={"100%"}
                  height={"200px"}
                  borderRadious={"10px"}
                >
                  <div className="order-details__info__customer-info__container__top">
                    <div className="order-details__info__customer-info__container__top__icon">
                      {item.icon}
                    </div>
                    <div className="order-details__info__customer-info__container__top__details">
                      <div className="order-details__info__customer-info__container__top__details__header">
                        {item.title}
                      </div>
                      <div className="order-details__info__customer-info__container__top__details__description">
                        {item.details}
                      </div>
                    </div>
                  </div>
                  <div className="order-details__info__customer-info__container__bottom">
                    <div className="order-details__info__customer-info__container__bottom__button">
                      <button>Chi tiết</button>
                    </div>
                  </div>
                </CustomizedCard>
              </Col>
            ))}
          </Row>
        </div>
        <div className="order-details__info__payment">
          <div className="order-details__info__payment__info">
            <div className="order-details__info__payment__info__title">
              <div>Thông tin thanh toán</div>
            </div>
            <div className="order-details__info__payment__info__description">
              <div>
                <FontAwesomeIcon icon={faCcMastercard} />
                <span className="order-details__info__payment__info__description__item">
                  Master Card **** **** 6557
                </span>
              </div>
              <div className="order-details__info__payment__info__description__item">
                Tên : Shristi Singh{" "}
              </div>
              <div className="order-details__info__payment__info__description__item">
                Tên ngân hàng : ADB
              </div>
            </div>
          </div>
          <div className="order-details__info__payment__note">
            <div className="order-details__info__payment__note__title">
              <span>Ghi chú</span>
            </div>
            <div className="order-details__info__payment__note__description">
              <span>Những lưu ý :</span>
            </div>
          </div>
        </div>
      </div>
      <div className="order-details__list">
        <div className="order-details__list__header">
          <div className="order-details__list__header__left">Danh sách sản phẩm</div>
          <div className="order-details__list__header__right">
            <MoreOutlined />
          </div>
        </div>
        <div className="order-details__list__table">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </div>
        <div className="order-details__list__bill">
          <div className="order-details__list__bill__content">
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">Tổng</span>
              <span>{formatMoney(5000000)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">Thuế (20%) </span>
              <span>{formatMoney(50000)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">Giảm giá</span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span className="order-details__list__bill__content__item__title">Phí giao hàng</span>
              <span>{formatMoney(0)}</span>
            </div>
            <div className="order-details__list__bill__content__item">
              <span id="total" className="order-details__list__bill__content__item__title">
                Tổng cộng
              </span>
              <span id="totalValue">{formatMoney(5050000)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
