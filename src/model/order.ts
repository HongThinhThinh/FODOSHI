export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export interface Order {
  key: string;
  product: string;
  orderId: string;
  date: string;
  customerName: string;
  status: OrderStatus;
  total: string;
}
