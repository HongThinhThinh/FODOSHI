export enum OrderStatus {
  Pending = "Pending",
  Processing = "Đamg xử lí",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Paid = "Đã thanh toán",
}

export interface Order {
  id: number;
  orderId: string;
  date: string;
  customerName: string;
  status: OrderStatus;
  total: string;
}

export interface OrderDetails {
  id: number;
  productName: string;
  orderId?: string;
  price: number;
  quantity: number;
}
