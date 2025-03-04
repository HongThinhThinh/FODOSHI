/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatMoney(amount: any): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
