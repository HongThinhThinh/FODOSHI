import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/login-page";
import AdminLayout from "../components/layouts/admin-layout";
import Dashboard from "../components/pages/admin/manage-overview";
import ProductDetail from "../components/pages/admin/product-detail";
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
        element: <h1>products content</h1>,
      },
      {
        path: "orders",
        element: <h1>orders content</h1>,
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
