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
