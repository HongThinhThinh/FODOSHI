import React, { useState, useEffect } from "react";
import "./index.scss";
import {
  CalendarOutlined,
  DownOutlined,
  MoreOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  UserOutlined,
  LoadingOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Menu,
  Row,
  Spin,
  message,
  Modal,
  Descriptions,
  Tag,
  Empty,
  Avatar,
} from "antd";
import CustomizedCard from "../../../molecules/card/Card";
import { formatMoney } from "../../../../utils/formatMoney";
import { toTitle } from "../../../../utils/formatStr";
import { useLocation } from "react-router-dom";
import GenericTable, { ColumnType } from "../../../atoms/table";
import type { OrderDetails } from "../../../../model/order";
import api from "../../../../config/api";

// Define interfaces for API response
interface ApiOrderItem {
  id: string;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    brands: Array<{
      id: number;
      name: string;
      image: string;
      isDeleted: boolean;
    }>;
    categories: Array<{
      id: number;
      name: string;
      image: string;
      isDeleted: boolean;
    }>;
    sellingPrice: number;
    imageUrls: Array<{ id: number; image: string }>;
    mainImage?: string;
    consignor: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      addresses: Array<{
        id: number;
        address: string;
        province: string;
        district: string;
        commune: string;
        isDefault?: boolean;
      }>;
      role: string;
      createdAt: string;
      username: string;
    };
  };
}

interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string | null;
  addresses?: Array<{
    id: number;
    address: string;
    province: string;
    district: string;
    commune: string;
    isDefault?: boolean;
  }>;
  role?: string;
  createdAt?: string;
  username?: string;
  isGuest?: boolean;
}

interface CustomerAddress {
  id?: number;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
}

interface ApiOrder {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    image: string | null;
    addresses: Array<{
      id: number;
      address: string;
      province: string;
      district: string;
      commune: string;
      isDefault?: boolean;
    }>;
    role: string;
    createdAt: string;
    username: string;
  };
  address: {
    id: number;
    address: string;
    province: string;
    district: string;
    commune: string;
    isDeleted: boolean;
    guestName: string | null;
    guestPhone: string | null;
    guestEmail: string | null;
  } | null;
  orderItems: ApiOrderItem[];
  shippingAddress?: {
    address: string;
    province: string;
    district: string;
    commune: string;
  };
  paymentMethod?: string;
  shippingMethod?: string;
  orderHistories?: Array<{
    id: string | number;
    status: string;
    note?: string;
    createdAt: string;
  }>;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: ApiOrder;
}

export default function OrderDetails() {
  const [status, setStatus] = useState<string>("Change Status");
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<ApiOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderDetails[]>([]);
  const location = useLocation();
  const currentSubPath = location.pathname.split("/")[3];
  const id = currentSubPath;
  // Modal states
  const [customerModalVisible, setCustomerModalVisible] =
    useState<boolean>(false);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);
  const [orderInfoModalVisible, setOrderInfoModalVisible] =
    useState<boolean>(false);

  // Store customer information
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [customerAddress, setCustomerAddress] =
    useState<CustomerAddress | null>(null);

  // Add these debug functions near the top of your component
  const handleCustomerDetailClick = () => {
    console.log("Opening customer modal");
    setCustomerModalVisible(true);
  };

  const handleAddressDetailClick = () => {
    console.log("Opening address modal");
    setAddressModalVisible(true);
  };

  const handleOrderInfoDetailClick = () => {
    console.log("Opening order info modal");
    setOrderInfoModalVisible(true);
  };

  // Rest of the component remains the same...
}
