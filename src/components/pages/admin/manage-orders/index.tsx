import React from "react";
import "./index.scss";
import { Table } from "antd";
import { recentOrdersDummyData } from "../../../../dummy-data/recent-order-data";
import { MoreOutlined } from "@ant-design/icons";
import { OrderStatus } from "../../../../model/order";
import { useNavigate } from "react-router-dom";
function OrderManagement() {
  const navigate = useNavigate();
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
            <Table
              columns={columns}
              dataSource={recentOrdersDummyData}
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/admin/orders/${record.orderId}`);
                  },
                };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
