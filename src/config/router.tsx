import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../components/pages/login-page";
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
    path: "/login",
    element: <LoginPage />,
  },
]);
