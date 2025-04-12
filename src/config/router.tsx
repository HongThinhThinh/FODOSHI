import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/atoms/protected-route";

import Dashboard from "../components/pages/admin/manage-overview";
import ProductDetail from "../components/pages/admin/product-detail";
import ForgetPassword from "../components/pages/auth/forget-password";
import ConfirmPassword from "../components/pages/auth/confirm-password";
import SuccessAuth from "../components/pages/auth/success-auth";
import ProductsPage from "../components/pages/admin/products";
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
import AdminLayoutCustom from "../layouts/admin/AdminLayout";
import { mockAdminRouteData } from "../dummy-data/mockAdminRouteData";
import ProductSearchPage from "../components/pages/product-search-page";

import DeliveryAddress from "../components/pages/infomation-page/delivery-address";
import PaymentMethod from "../components/pages/infomation-page/payment-method";
import DepositPolicy from "../components/pages/infomation-page/deposit/policy";
import ProductDetails from "../components/pages/customer/product-details";
import AuthenticationLayout from "../layouts/auth/AuthenticationLayout";
import ConsignmentPage from "../components/pages/consignment";
import MalePage from "../components/pages/male-page";
import Error404 from "../components/pages/404";
import ProductByCategory from "../components/pages/customer/categoryProduct";
import CamOnAnhBaoNhieuNha from "../components/pages/customer/camOnAnhBao";
import ManageCategory from "../components/pages/admin/manage-category";
import ManageBrand from "../components/pages/admin/manage-brand";
import PaymentSuccess from "../components/pages/customer/payment-success";
import PaymentCancel from "../components/pages/customer/payment-cancel";
import BlogDetail from "../components/pages/blog-detail";
import OrderList from "../components/pages/admin/order-list";
import OrderTrackingPage from "../components/pages/customer/order-tracking";
import OrderHistoryPage from "../components/pages/customer/order-history";
import ProfilePage from "../components/pages/customer/profile";
import Header from "../components/organisms/header";
import SignUp from "../components/pages/auth/register-page-2";
import Login from "../components/pages/auth/login-page-2";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/test",
    element: <div className="text-3xl font-bold underline bg-black">Hi</div>,
  },
  {
    path: "/product-details",
    element: <ProductDetails />,
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-cancel",
    element: <PaymentCancel />,
  },
  {
    path: "/camOnAnhBao",
    element: <CamOnAnhBaoNhieuNha />,
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
        path: "search",
        element: <ProductSearchPage />,
      },
      {
        path: "infomation",
        element: (
          <ProtectedRoute>
            <InfomationLayout />
          </ProtectedRoute>
        ),
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
            element: <DeliveryAddress />,
          },
          {
            path: "paymentMethod",
            element: <PaymentMethod />,
          },
          {
            path: "deposit",
            element: (
              <InfomationTabLayout
                data={[
                  { path: "registration", name: "Đăng ký ký gửi" },
                  { path: "tracking", name: "Theo dõi đơn hàng" },
                  { path: "instruction", name: "Hướng dẫn ký gửi" },
                  { path: "policy", name: "Chính sách ký gửi" },
                ]}
              />
            ),
            children: [
              {
                path: "tracking",
                element: <>hello youtube</>,
              },
              {
                path: "registration",
                element: (
                  <>
                    <ConsignmentPage />
                  </>
                ),
              },
              {
                path: "instruction",
                element: <>hello youtube</>,
              },
              {
                path: "policy",
                element: <DepositPolicy />,
              },
            ],
          },
        ],
      },
      {
        path: "/productByCategory/:id",
        element: <ProductByCategory />,
      },
      {
        path: "/consignment",
        element: <ConsignmentPage />,
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
        path: "/about",
        element: <About />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/track-order",
        element: <OrderTrackingPage />,
      },
      {
        path: "male",
        element: <MalePage />,
      },
      {
        path: "/product-detail/:id",
        element: <ProductDetails />,
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <>
          <Header />
          <ProfilePage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "infomation",
    element: <InfomationLayout />,
    children: [
      {
        path: "consignment",
        element: <ConsignmentPage />,
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
    ],
  },

  {
    path: "/admin",
    element: <AdminLayoutCustom routes={mockAdminRouteData} />,
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
        element: <OrderList />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
      {
        path: "category",
        element: <ManageCategory />,
      },
      {
        path: "brand",
        element: <ManageBrand />,
      },
      // {
      //   path: "categories",
      //   element: (
      //     <CategoryAdminLayout categoriesPath={mockAdminCategoryRouteData} />
      //   ),
      //   children: [
      //     {
      //       path: "clothing",
      //       element: "Clothing",
      //     },
      //     {
      //       path: "bags",
      //       element: "Túi xách",
      //     },
      //     {
      //       path: "shoes",
      //       element: "Giày dép",
      //     },
      //     {
      //       path: "accessories",
      //       element: "Phụ kiện",
      //     },
      //     {
      //       path: "jewelry",
      //       element: "Trang sức",
      //     },
      //     {
      //       path: "other",
      //       element: "Khác",
      //     },
      //   ],
      // },
      {
        path: "products/:id",
        element: <ProductDetail product_id={"123"} />,
      },
    ],
  },

  // {
  //   path: "/auth",
  //   element: <Authentication />,
  // },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },

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
  {
    path: "",
    element: <AuthenticationLayout />,
    children: [
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
