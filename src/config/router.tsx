import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/login-page";
import AdminLayout from "../components/layouts/admin-layout";
import Dashboard from "../components/pages/admin/manage-overview";
import ProductDetail from "../components/pages/admin/product-detail";
import ProductsPage from "../components/pages/admin/products";
import OrderManagement from "../components/pages/admin/manage-orders";
import OrderDetails from "../components/pages/admin/order-details";
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
        element: <h1>hi</h1>,
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
    path: "/login",
    element: <LoginPage />,
  },
]);
