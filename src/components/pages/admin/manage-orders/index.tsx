import React, { useEffect, useState } from "react";
import "./index.scss";
import { message, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Order, OrderStatus } from "../../../../model/order";
import { useNavigate } from "react-router-dom";
import GenericTable, { ColumnType } from "../../../atoms/table";
import api from "../../../../config/api";
import { formatMoney } from "../../../../utils/formatMoney";

// Interface para representar o formato da API
interface ApiOrder {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  orderItems: {
    id: string;
    price: number;
    product: {
      id: number;
      name: string;
      // ... outros campos do produto
    };
  }[];
}

// Interface para resposta da API
interface ApiResponse {
  statusCode: number;
  message: string;
  data: ApiOrder[];
}

function OrderManagement() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para mapear os dados da API para o formato esperado pela tabela
  const mapApiDataToTableData = (apiData: ApiOrder[]): Order[] => {
    return apiData.map((order) => {
      // Obter o primeiro produto como representante do pedido (para exibição na tabela)
      const firstProduct = order.orderItems[0]?.product;

      return {
        id: parseInt(order.id.substring(0, 8), 16), // Gera um ID numérico a partir do UUID
        orderId: order.id,
        date: order.createdAt,
        customerName: firstProduct
          ? firstProduct.name
          : "Cliente não disponível",
        status: mapApiStatusToOrderStatus(order.status),
        total: formatMoney(order.totalPrice),
      };
    });
  };

  // Mapeia os status da API para os status do enum OrderStatus
  const mapApiStatusToOrderStatus = (apiStatus: string): OrderStatus => {
    switch (apiStatus) {
      case "PENDING_PAYMENT":
        return OrderStatus.Pending;
      case "COMPLETED":
        return OrderStatus.Completed;
      case "CANCELLED":
        return OrderStatus.Cancelled;
      default:
        return OrderStatus.Processing;
    }
  };

  // Fetch dos dados da API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse>("/order");

        if (response.data.statusCode === 200) {
          const mappedOrders = mapApiDataToTableData(response.data.data);
          setOrders(mappedOrders);
        } else {
          message.error("Erro ao carregar pedidos: " + response.data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        message.error("Erro ao buscar pedidos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      render: (
        status:
          | OrderStatus.Pending
          | OrderStatus.Processing
          | OrderStatus.Completed
          | OrderStatus.Cancelled
      ) => {
        const statusColor = {
          Pending: "orange",
          Processing: "blue",
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
        <div className="orders__table__container p-0">
          <div className="orders__table__container__body p-0">
            {loading ? (
              <div className="loading-container">
                <Spin tip="Carregando..." size="large" />
              </div>
            ) : (
              <GenericTable
                columns={columns}
                data={orders}
                onRow={(record) => {
                  // Navegar para a página de detalhes do pedido com o ID real
                  navigate(`/admin/orders/${record.orderId}`);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
