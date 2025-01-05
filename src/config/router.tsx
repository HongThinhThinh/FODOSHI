import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/auth/login-page";
import AdminLayout from "../components/layouts/admin-layout";
import Dashboard from "../components/pages/admin/manage-overview";
import ProductDetail from "../components/pages/admin/product-detail";

import Authentication from "../components/pages/auth/authentication";
import RegisterPage from "../components/pages/auth/register-page";
import ForgetPassword from "../components/pages/auth/forget-password";
import ConfirmPassword from "../components/pages/auth/confirm-password";
import SuccessAuth from "../components/pages/auth/success-auth";

import ProductsPage from "../components/pages/admin/products";
import OrderManagement from "../components/pages/admin/manage-orders";
import OrderDetails from "../components/pages/admin/order-details";
import Cart from "../components/pages/customer/cart";
import HomePage from "../components/pages/homepage";
import NewProductPage from "../components/pages/new-product-page";
import ShoezizePage from "../components/pages/shoe-size-page";
import About from "../components/pages/about";
import Blog from "../components/pages/blog";
import InfomationLayout from "../layouts/InfomationLayout";
import InfoPersonal from "../components/pages/infomation-page/info-personal";
import InfomationTabLayout from "../layouts/InfomationTabLayout";

import DeliveryAddress from "../components/pages/infomation-page/delivery-address";
import PaymentMethod from "../components/pages/infomation-page/payment-method";

export const router = createBrowserRouter([
  {
    path: "/test",
    element: <div className="text-3xl font-bold underline bg-black">Hi</div>,
  },
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/newProduct",
        element: <NewProductPage />,
      },
      {
        path: "/shoeSize",
        element: <ShoezizePage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "infomation",
    element: <InfomationLayout />,
    children: [
      {
        path: "infomationPersonal",
        element: <InfoPersonal />,
        children: [
          {
            path: "waitingForShipping",
            element: <h1>Waiting for shipping</h1>,
          },
          {
            path: "shipping",
            element: <h1>Shipping</h1>,
          },
          {
            path: "handDelivered",
            element: <h1>Hand delivered</h1>,
          },
        ],
      },
      {
        path: "orderStatus",
        element: (
          <InfomationTabLayout
            data={[
              { path: "waitingForShipping", name: "Chờ vận chuyển" },
              { path: "shipping", name: "Đang vận chuyển" },
              { path: "handDelivered", name: "Đã giao tận tay" },
            ]}
          />
        ),
        children: [
          {
            path: "waitingForShipping",
            element: <h1>Waiting for shipping</h1>,
          },
          {
            path: "shipping",
            element: <h1>Shipping</h1>,
          },
          {
            path: "handDelivered",
            element: <h1>Hand delivered</h1>,
          },
        ],
      },
      {
        path: "deliveryAddress",
        element: <h1>Địa chỉ Giao hàng</h1>,
      },
    ],
  },
  {
    path: "infomation",
    element: <InfomationLayout />,
    children: [
      {
        path: "infomationPersonal",
        element: <InfoPersonal />,
        children: [
          {
            path: "waitingForShipping",
            element: <h1>Waiting for shipping</h1>,
          },
          {
            path: "shipping",
            element: <h1>Shipping</h1>,
          },
          {
            path: "handDelivered",
            element: <h1>Hand delivered</h1>,
          },
        ],
      },
      {
        path: "orderStatus",
        element: (
          <InfomationTabLayout
            data={[
              { path: "waitingForShipping", name: "Chờ vận chuyển" },
              { path: "shipping", name: "Đang vận chuyển" },
              { path: "handDelivered", name: "Đã giao tận tay" },
            ]}
          />
        ),
        children: [
          {
            path: "waitingForShipping",
            element: <h1>Waiting for shipping</h1>,
          },
          {
            path: "shipping",
            element: <h1>Shipping</h1>,
          },
          {
            path: "handDelivered",
            element: <h1>Hand delivered</h1>,
          },
        ],
      },
      {
        path: "deliveryAddress",
        element: <h1>Địa chỉ Giao hàng</h1>,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
      {
        path: "products/:id",
        element: <ProductDetail product_id={"123"} />,
      },
    ],
  },

  {
    path: "/auth",
    element: <Authentication />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/confirm-password",
    element: <ConfirmPassword />,
  },
  {
    path: "/success-auth",
    element: <SuccessAuth />,
  },
]);
