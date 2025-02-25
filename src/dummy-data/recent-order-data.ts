import { Order } from "../model/order";
import { OrderStatus } from "../model/order";
export const recentOrdersDummyData: Order[] = [
  {
    id: 1,
    orderId: "ORD12345",
    date: "2024-12-20",
    customerName: "Nguyen Van A",
    status: OrderStatus.Pending,
    total: "2,500,000 VND",
  },
  {
    id: 2,
    orderId: "ORD12346",
    date: "2024-12-19",
    customerName: "Tran Thi B",
    status: OrderStatus.Completed,
    total: "3,000,000 VND",
  },
  {
    id: 3,
    orderId: "ORD12347",
    date: "2024-12-18",
    customerName: "Le Van C",
    status: OrderStatus.Cancelled,
    total: "1,800,000 VND",
  },
  {
    id: 4,
    orderId: "ORD12348",
    date: "2024-12-17",
    customerName: "Pham Thi D",
    status: OrderStatus.Pending,
    total: "2,200,000 VND",
  },
];
