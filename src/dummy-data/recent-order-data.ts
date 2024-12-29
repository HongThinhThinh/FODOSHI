import { Order } from "../model/order";
import { OrderStatus } from "../model/order";
export const recentOrdersDummyData: Order[] = [
  {
    key: "1",
    product: "Nike Air Max",
    orderId: "ORD12345",
    date: "2024-12-20",
    customerName: "Nguyen Van A",
    status: OrderStatus.Pending,
    total: "2,500,000 VND",
  },
  {
    key: "2",
    product: "Adidas UltraBoost",
    orderId: "ORD12346",
    date: "2024-12-19",
    customerName: "Tran Thi B",
    status: OrderStatus.Completed,
    total: "3,000,000 VND",
  },
  {
    key: "3",
    product: "Puma Suede",
    orderId: "ORD12347",
    date: "2024-12-18",
    customerName: "Le Van C",
    status: OrderStatus.Cancelled,
    total: "1,800,000 VND",
  },
  {
    key: "4",
    product: "Reebok Classic",
    orderId: "ORD12348",
    date: "2024-12-17",
    customerName: "Pham Thi D",
    status: OrderStatus.Pending,
    total: "2,200,000 VND",
  },
];
