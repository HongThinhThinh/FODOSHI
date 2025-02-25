import React from "react";
import "./index.scss";
import { Table } from "antd";
import { recentOrdersDummyData } from "../../../../dummy-data/recent-order-data";
import { MoreOutlined } from "@ant-design/icons";
import { Order, OrderStatus } from "../../../../model/order";
import { useNavigate } from "react-router-dom";
import GenericTable, { ColumnType } from "../../../atoms/table";
function OrderManagement() {
  const navigate = useNavigate();
  const columns: ColumnType<Order>[] = [
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus.Pending | OrderStatus.Completed | OrderStatus.Cancelled) => {
        const statusColor = {
          Pending: "orange",
          Completed: "green",
          Cancelled: "red",
        };
        return <span style={{ color: statusColor[status] }}>{status}</span>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
    },
  ];
  return (
    <div className="orders">
      <div className="orders__table">
        <div className="orders__table__container">
          <div className="orders__table__container__header">
            <div className="orders__table__container__header__left">
              <span>Những đơn hàng gần đây</span>
            </div>
            <div className="orders__table__container__header__right">
              <MoreOutlined />
            </div>
          </div>
          <div className="orders__table__container__body">
            <GenericTable
              columns={columns}
              data={recentOrdersDummyData}
              onRow={(record) => {
                navigate(`${record.orderId}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
