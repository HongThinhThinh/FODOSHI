export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
  Cancelled = "Cancelled",
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
