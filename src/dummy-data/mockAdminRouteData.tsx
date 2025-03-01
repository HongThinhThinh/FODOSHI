import { FaChartPie } from "react-icons/fa";
import { FcDataConfiguration } from "react-icons/fc";
import { SlCalender } from "react-icons/sl";
import { MdCategory } from "react-icons/md";
import { TbBrandAirtable } from "react-icons/tb";
export interface RouteType {
  path: string;
  name: string;
  icon?: React.ReactNode;
}
export const mockAdminRouteData: RouteType[] = [
  {
    path: "dashboard",
    name: "Dashboard",
    icon: <FaChartPie />,
  },
  {
    path: "products",
    name: "Products",
    icon: <FcDataConfiguration />,
  },
  {
    path: "orders",
    name: "Orders",
    icon: <SlCalender />,
  },
  {
    path: "category",
    name: "Category",
    icon: <MdCategory />,
  },
  {
    path: "brand",
    name: "Brand",
    icon: <TbBrandAirtable />,
  },
];

export const mockAdminCategoryRouteData: RouteType[] = [
  {
    path: "clothing",
    name: "Quần áo",
  },
  {
    path: "bags",
    name: "Túi xách",
  },
  {
    path: "shoes",
    name: "Giày dép",
  },
  {
    path: "accessories",
    name: "Phụ kiện",
  },
  {
    path: "jewelry",
    name: "Trang sức",
  },
  {
    path: "other",
    name: "Khác",
  },
];

export interface ProductCategoryRoute {
  id: number;
  name: string;
  path: string;
  quantity: number;
}

export const fashionCategoryRoutesData: ProductCategoryRoute[] = [
  {
    id: 1,
    name: "Quần áo",
    path: "clothing",
    quantity: 20,
  },
  {
    id: 2,
    name: "Túi xách",
    path: "bags",
    quantity: 20,
  },
  {
    id: 3,
    name: "Giày dép",
    path: "shoes",
    quantity: 20,
  },
  {
    id: 4,
    name: "Phụ kiện",
    path: "accessories",
    quantity: 20,
  },
  {
    id: 5,
    name: "Trang sức",
    path: "jewelry",
    quantity: 20,
  },
  {
    id: 6,
    name: "Khác",
    path: "other",
    quantity: 20,
  },
];
