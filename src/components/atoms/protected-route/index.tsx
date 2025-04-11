import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import getCurrentUser from "../../../utils/getCurrentUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Thử lấy thông tin người dùng từ API
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập và lưu lại đường dẫn hiện tại
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: "Vui lòng đăng nhập để truy cập trang này",
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
