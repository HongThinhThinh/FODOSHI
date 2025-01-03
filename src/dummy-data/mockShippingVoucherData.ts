import { ShippingVoucher } from "../model/shippingVoucher";

export const shippingVouchers: ShippingVoucher[] = [
  {
    id: 1,
    code: "FREE50",
    discount: 50,
    description: "Giảm giá 50% phí vận chuyển",
  },
  {
    id: 2,
    code: "SHIP20",
    discount: 20,
    description: "Giảm giá 20% phí vận chuyển",
  },
  {
    id: 3,
    code: "FREESHIP",
    discount: 100,
    description: "Miễn phí vận chuyển toàn bộ đơn hàng",
  },
];
